from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser
    """
    profile_picture_url = models.URLField(blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
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
    course_id = models.AutoField(primary_key=True)
    course_code = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    description = models.TextField()
    enrolled_users = models.ManyToManyField(User, through='UserCourse')
    
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


class StudySession(models.Model):
    """
    Study session model for organizing study events
    """
    session_id = models.AutoField(primary_key=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_sessions')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='study_sessions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=255)
    is_virtual = models.BooleanField(default=False)
    meeting_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(User, through='SessionParticipant', related_name='joined_sessions')
    
    def __str__(self):
        return f"{self.title} ({self.course.course_code})"


class SessionParticipant(models.Model):
    """
    Many-to-many relationship between users and study sessions
    """
    participant_id = models.AutoField(primary_key=True)
    session = models.ForeignKey(StudySession, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('session', 'user')
        
    def __str__(self):
        return f"{self.user.email} in session {self.session.session_id}"


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
    link_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=50)
    url = models.URLField()
    
    class Meta:
        unique_together = ('user', 'platform')
        
    def __str__(self):
        return f"{self.user.email}'s {self.platform} link"