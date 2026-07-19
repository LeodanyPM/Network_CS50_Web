from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField('self', symmetrical=False, related_name='followers')

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post" )
    date = models.DateTimeField(auto_now_add=True)
    body = models.TextField()
    
    @property
    def likes_count(self):
        return self.likes.count()
        
    class Meta:
         ordering = ['-date']
    def __str__(self):
         return f"{self.user} post at {self.date}"
class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="user_likes")
        
    class Meta:
        unique_together = ['post', 'user']
    def __str__(self):
        return f"{self.user} liked {self.post}"
