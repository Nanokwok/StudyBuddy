from rest_framework import serializers
from django.db.models import Q
from .models import *
from django.conf import settings
from .utils.s3_utils import get_full_s3_url


class SocialMediaLinkSerializer(serializers.ModelSerializer):
    """
    Serializer for social media links.
    """
    class Meta:
        model = SocialMediaLink
        fields = ['link_id', 'platform', 'name']


class UserSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()
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

    def get_profile_picture_url(self, obj):
        return get_full_s3_url(obj.profile_picture_url)

    def get_friendship_count(self, obj):
        return Friendship.objects.filter(
            (Q(requester=obj) | Q(addressee=obj)) & Q(status='accepted')
        ).count()


class UserBasicSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile_picture_url', 'bio']

    def get_profile_picture_url(self, obj):
        if not obj.profile_picture_url:
            return None
            
        if hasattr(obj.profile_picture_url, 'url'):
            url = obj.profile_picture_url.url
        else:
            url = str(obj.profile_picture_url)
        
        if url.startswith('http'):
            return url
        return f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{url}"


class CourseSerializer(serializers.ModelSerializer):
    """
    Serializer for course information.
    """
    class Meta:
        model = Course
        fields = ['course_id', 'course_code', 'title', 'subject', 'description']


class CourseDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for detailed course information, including enrolled user count.
    """
    enrolled_user_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['course_id', 'course_code', 'title', 'subject', 
                  'description', 'enrolled_user_count']

    def get_enrolled_user_count(self, obj):
        """Get the number of users enrolled in a course."""
        return obj.enrolled_users.count()


class UserCourseSerializer(serializers.ModelSerializer):
    """
    Serializer for linking users to courses.
    """
    course = CourseSerializer()

    class Meta:
        model = UserCourse
        fields = ['user_course_id', 'user', 'course', 'enrolled_at']

    def create(self, validated_data):
        """Create a UserCourse relationship when a user enrolls in a course."""
        user_id = self.context['request'].data.get('user_id')
        course_id = self.context['request'].data.get('course_id')

        user = User.objects.get(id=user_id)
        course = Course.objects.get(course_id=course_id)

        user_course = UserCourse.objects.create(
            user=user,
            course=course
        )
        return user_course


class FriendshipSerializer(serializers.ModelSerializer):
    """
    Serializer for friendship requests, including requester and addressee information.
    """
    requester = UserBasicSerializer(read_only=True)
    addressee = UserBasicSerializer(read_only=True)

    class Meta:
        model = Friendship
        fields = ['friendship_id', 'requester', 'addressee', 
                  'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Create a friendship request between two users."""
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
    """
    Serializer for updating friendship status.
    """
    class Meta:
        model = Friendship
        fields = ['status']


class UserProfilePictureSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['profile_picture_url']

    def get_profile_picture_url(self, obj):
        if not obj.profile_picture_url:
            return None
            
        if hasattr(obj.profile_picture_url, 'url'):
            url = obj.profile_picture_url.url
        else:
            url = str(obj.profile_picture_url)
        
        if url.startswith('http'):
            return url
        return f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{url}"
    