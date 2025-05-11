from rest_framework import serializers
from django.db.models import Q
from .models import *


class SocialMediaLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaLink
        fields = ['link_id', 'platform', 'name']


class UserSerializer(serializers.ModelSerializer):
    social_links = SocialMediaLinkSerializer(many=True, read_only=True)
    friendship_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'profile_picture_url', 'created_at', 'last_login', 'social_links', 
                  'bio', 'friendship_count']
        read_only_fields = ['id', 'created_at', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def get_friendship_count(self, obj):
        # Count accepted friendships where user is either requester or addressee
        return Friendship.objects.filter(
            (Q(requester=obj) | Q(addressee=obj)) & Q(status='accepted')
        ).count()


class UserBasicSerializer(serializers.ModelSerializer):
    """Lightweight User serializer for nested relationships"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile_picture_url']


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'course_code', 'title', 'subject', 'description']


class CourseDetailSerializer(serializers.ModelSerializer):
    enrolled_user_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['course_id', 'course_code', 'title', 'subject', 
                  'description', 'enrolled_user_count']
    
    def get_enrolled_user_count(self, obj):
        return obj.enrolled_users.count()


class UserCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer()
    
    class Meta:
        model = UserCourse
        fields = ['user_course_id', 'user', 'course', 'enrolled_at']
    
    def create(self, validated_data):
        user_id = self.context['request'].data.get('user_id')
        course_id = self.context['request'].data.get('course_id')
        
        user = User.objects.get(id=user_id)
        course = Course.objects.get(course_id=course_id)
        
        user_course = UserCourse.objects.create(
            user=user,
            course=course
        )
        return user_course
    
    
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'course_code', 'title', 'subject']


class FriendshipSerializer(serializers.ModelSerializer):
    requester = UserBasicSerializer(read_only=True)
    addressee = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Friendship
        fields = ['friendship_id', 'requester', 'addressee', 
                  'status', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        requester_id = self.context['request'].data.get('requester_id')
        addressee_id = self.context['request'].data.get('addressee_id')
        
        requester = User.objects.get(id=requester_id)
        addressee = User.objects.get(id=addressee_id)
        
        friendship = Friendship.objects.create(
            requester=requester,
            addressee=addressee,
            **validated_data
        )
        return friendship


class FriendshipUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['status']
