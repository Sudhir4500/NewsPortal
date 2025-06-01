import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField  # Import CloudinaryField from the official cloudinary package

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    bio = models.TextField(max_length=500, blank=True)
    # profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    profile_picture = CloudinaryField('profile_picture', blank=True, null=True, help_text="Upload a profile picture. Supported formats: jpg, png, webp.")
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'                   # now login using email
    REQUIRED_FIELDS = ['username']             # username still required for admin
    # Add safeguard in model's save method
    def save(self, *args, **kwargs):
        if not self.email:
            raise ValueError("Users must have an email address")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email
