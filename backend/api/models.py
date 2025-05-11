from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _

def upload_thumbnail(instance, filename):
    """
    Return the S3 path where the user's profile picture will be stored.
    Format: profile_pictures/username/filename.ext
    """
    extension = filename.split('.')[-1]
    return f'profile_pictures/{instance.username}/profile.{extension}'


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Adds profile picture, bio, timestamps, and permissions.
    """
    profile_picture_url = models.ImageField(
        upload_to=upload_thumbnail,
        blank=True,
        null=True
    )
    last_login = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    bio = models.TextField(blank=True, null=True)

    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_set',
        related_query_name='custom_user'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_set',
        related_query_name='custom_user'
    )

    def __str__(self):
        return self.email


class Course(models.Model):
    """
    Course model representing educational content
    """
    days_of_week = (
        ('Mon', 'Monday'),
        ('Tue', 'Tuesday'),
        ('Wed', 'Wednesday'),
        ('Thu', 'Thursday'),
        ('Fri', 'Friday'),
        ('Sat', 'Saturday'),
        ('Sun', 'Sunday'),
    )

    course_id = models.AutoField(primary_key=True)
    course_code = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    description = models.TextField()
    enrolled_users = models.ManyToManyField(User, through='UserCourse')
    study_schedules_day = models.CharField(max_length=3, choices=days_of_week)
    study_schedules_time = models.TimeField()
    
    def __str__(self):
        return f"{self.course_code}: {self.title}"


class UserCourse(models.Model):
    """
    Many-to-many relationship between users and courses
    """
    user_course_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'course')
        
    def __str__(self):
        return f"{self.user.email} enrolled in {self.course.course_code}"


class Friendship(models.Model):
    """
    Friendship model representing connections between users
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    
    friendship_id = models.AutoField(primary_key=True)
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_requests_sent')
    addressee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_requests_received')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('requester', 'addressee')
        
    def __str__(self):
        return f"{self.requester.email} -> {self.addressee.email}: {self.status}"


class SocialMediaLink(models.Model):
    """
    Social media links associated with a user
    """
    platform_choices = (
        ('Facebook', 'Facebook'),
        ('Instagram', 'Instagram'),
    )

    link_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=50, choices=platform_choices)
    name = models.CharField(max_length=50)
    
    class Meta:
        unique_together = ('user', 'platform')
        
    def __str__(self):
        return f"{self.user.email}'s {self.platform} link"