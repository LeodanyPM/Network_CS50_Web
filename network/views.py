from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
import json
from django.db.models import Count,  Exists, OuterRef
from .models import User, Post, Like


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def paginate_posts(queryset, request, posts_per_page=10):
    paginator = Paginator(queryset, posts_per_page)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    return {
        'page_obj': page_obj,
        'pagination': {
            'current_page': page_obj.number,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'next_page': page_obj.next_page_number() if page_obj.has_next() else None,
            'previous_page': page_obj.previous_page_number() if page_obj.has_previous() else None,
        }
    }
    
        
@login_required        
@csrf_exempt        
def post(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    user = request.user
    body = json.loads(request.body).get('body')    
    if not body or body.strip() =="":
         return JsonResponse({"error":"Debes escribir algo"}, status=400)
    try:
        Post.objects.create(user=user, body=body)
        return JsonResponse({"message":"Creado"}, status=201)
    except User.DoesNotExist:
        return JsonResponse({
            "error": f"User does not exist."
        }, status=400)
   
    return JsonResponse({"error":"Método no permitido"}, status=405)
@login_required        
@csrf_exempt
def edit_post(request):
    
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    body = data.get('body')
    id = data.get('id')
    if not body or body.strip() == "":
        return JsonResponse({"error":"The post was not edited" },status=400)
    post = Post.objects.get(id=id)
    if request.user.id == post.user_id:
        post.body = body
        post.save()
        user_liked = Like.objects.filter(post=post, user=request.user).exists()
        new_data = post.serialize(True,user_liked)
        return JsonResponse(new_data, safe= False)
    else:
        return JsonResponse({"error": "You cannot edit other users' posts."}, status=400)    
        

def all_post(request):
    if request.method != 'GET':
        return JsonResponse({'error':"GET request required."}, status=400)
    if request.user.is_authenticated:
        all_posts = Post.objects.annotate( user_liked = Exists( Like.objects.filter(post=OuterRef('pk'), user=request.user)))
        post_page =paginate_posts(all_posts, request)
        serialized_posts = [post.serialize(post.user == request.user, post.user_liked) for post in post_page['page_obj']]
    else:
        all_posts = Post.objects.all()
        post_page = paginate_posts(all_posts, request)
        serialized_posts = [post.serialize(False, False) for post in post_page['page_obj']]
    return JsonResponse({
        'posts': serialized_posts,
        'pagination': post_page['pagination']
        }, safe=False)

@login_required      
def profile(request, id = None):
    if request.method != 'GET':
        return JsonResponse({'error':"GET request required."}, status=400)
    if id is not None:
        try:
            target_user = User.objects.get(id=id)
        except User.DoesNotExist:
            return JsonResponse({'error': "User not found."}, status=404)
        posts = Post.objects.filter(user = target_user)
        user_name = User.objects.get(id=id).username
        id_user = id
        if id == request.user.id:
            is_owner = True
            relation = 'Self'
        else:
            is_owner = False
            if User.objects.get(id = id) in request.user.following.all():
                relation ='Following'
            else:
                relation = 'Not Following'
    else:
        user_name = request.user.username
        id_user = request.user.id
        posts = Post.objects.filter(user = request.user)
        is_owner = True
        relation = 'Self'
    posts = posts.annotate(user_liked = Exists(Like.objects.filter(post=OuterRef('pk'), user = request.user)))
    post_page =paginate_posts(posts, request)    
    serialized_posts = [post.serialize(is_owner, post.user_liked) for post in post_page['page_obj'] ]
    user = User.objects.annotate(followers_count=Count('followers'), following_count=Count('following')).get(id=id_user)
    info = {
        'username': user_name,
        'id':id_user,
        'followers': user.followers_count,
        'following': user.following_count,
        'relation': relation
    }
    return JsonResponse({
                            'posts': serialized_posts,
                            'user_info': info,
                            'pagination': post_page['pagination']
                        },safe=False)
 
@login_required     
def following(request):
    if request.method != 'GET':
        return JsonResponse({'error':'GET request required.'}, status=400)
    user_f = request.user.following.all()
    posts = Post.objects.filter(user__in = user_f)
    posts = posts.annotate(user_liked = Exists(Like.objects.filter(post=OuterRef('pk'), user=request.user)))
    post_page = paginate_posts(posts, request)
    serialized_posts = [post.serialize(False, post.user_liked) for post in post_page['page_obj']]
    return JsonResponse({
        'posts': serialized_posts,
        'pagination': post_page['pagination']
        },safe=False)
    
@csrf_exempt
@login_required
def follow_toggle(request, user_id):
    if request.method not in ['POST', 'DELETE']:
        return JsonResponse({"error": "POST or DELETE required"}, status=405)
    
    try:
        user_to_follow = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    
    if user_to_follow == request.user:
        return JsonResponse({"error": "You can't follow yourself"}, status=400)
    
    if request.method == 'POST':
        request.user.following.add(user_to_follow)
        return JsonResponse({"message": f"Now you follow {user_to_follow.username}"}, status=201)
    
    elif request.method == 'DELETE':
        request.user.following.remove(user_to_follow)
        return JsonResponse({"message": f"You unfollowed {user_to_follow.username}"}, status=200)
@csrf_exempt
@login_required
def like(request, id):
   if request.method not in ['POST', 'GET']:
        return JsonResponse({"error": "POST or GET required"}, status=405)
   user = request.user
   try:
        post = get_object_or_404(Post, id=id)
   except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)
   
   if request.method == 'POST':
       like_obj, created = Like.objects.get_or_create(post = post, user = user)
       if created:
           return JsonResponse({"message": "Liked", "liked" : True, "likes_count" : post.likes_count }, status = 201)
       else: 
           like_obj.delete()
           return JsonResponse({"message": "UnLiked","liked": False, "likes_count":post.likes_count}, status = 200)
   if request.method == 'GET':
       liked = Like.objects.filter(post = post, user = user).exists()
       return JsonResponse({"liked":liked, "likes_count" : post.likes_count }, status = 200)
