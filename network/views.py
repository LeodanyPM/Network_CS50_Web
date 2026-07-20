from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json
from django.db.models import Count
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
        
@login_required        
@csrf_exempt        
def post(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    user = request.user
    body = json.loads(request.body).get('body')    
    if body =="":
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
def all_post(request):
    if request.method != 'GET':
        return JsonResponse({'error':"GET request required."}, status=400)
    all_posts = Post.objects.all()
    return JsonResponse([post.serialize() for post in all_posts], safe=False)

@login_required      
def profile(request):
    if request.method != 'GET':
        return JsonResponse({'error':"GET request required."}, status=400)
    data = Post.objects.filter(user = request.user)
    list_posts = [post.serialize() for post in data ]
    user = User.objects.annotate(followers_count=Count('followers'), following_count=Count('following')).get(id=request.user.id)
    info = {
        'username': user.username,
        'followers': user.followers_count,
        'following': user.following_count,
    }
    list_posts.append(info)
    return JsonResponse(list_posts,safe=False)
 
@login_required     
def following(request):
    if request.method == 'Get':
        return JsonResponse({'error':'GET request required.'}, status=400)
    user_f = request.user.following.all()
    posts = Post.objects.filter(user__in = user_f)
    return JsonResponse([post.serialize() for post in posts],safe=False)
    
