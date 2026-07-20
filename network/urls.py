
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.post, name= "post"),
    path("all_post", views.all_post, name="all_post"),
    path("page", views.profile, name= "profile"),
    path("following", views.following, name = "following")
]
