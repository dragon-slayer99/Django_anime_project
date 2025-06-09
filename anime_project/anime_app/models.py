from django.db import models

# Create your models here.
class user_detail(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField()
    date = models.DateField(auto_now=True)

    def __str__(self):
        return self.username
