from rest_framework import serializers
from .models import User, Course, UserCourse, StudySession, SessionParticipant, Friendship, SocialMediaLink


class SocialMediaLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaLink
        fields = ['link_id', 'platform', 'url']


class UserSerializer(serializers.ModelSerializer):
    social_links = SocialMediaLinkSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'profile_picture_url','created_at', 'last_login', 'social_links']
        read_only_fields = ['id', 'created_at', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user


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
    user = UserBasicSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    
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


class StudySessionListSerializer(serializers.ModelSerializer):
    creator = UserBasicSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    participant_count = serializers.SerializerMethodField()
    
    class Meta:
        model = StudySession
        fields = ['session_id', 'title', 'creator', 'course', 
                  'start_time', 'end_time', 'location', 
                  'is_virtual', 'participant_count']
    
    def get_participant_count(self, obj):
        return obj.participants.count()


class SessionParticipantSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = SessionParticipant
        fields = ['participant_id', 'user', 'joined_at']


class StudySessionDetailSerializer(serializers.ModelSerializer):
    creator = UserBasicSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    participants = serializers.SerializerMethodField()
    
    class Meta:
        model = StudySession
        fields = ['session_id', 'title', 'description', 'creator', 'course',
                  'start_time', 'end_time', 'location', 'is_virtual',
                  'meeting_link', 'created_at', 'participants']
    
    def get_participants(self, obj):
        participants = SessionParticipant.objects.filter(session=obj)
        return SessionParticipantSerializer(participants, many=True).data
    
    def create(self, validated_data):
        creator_id = self.context['request'].data.get('creator_id')
        course_id = self.context['request'].data.get('course_id')
        
        creator = User.objects.get(id=creator_id)
        course = Course.objects.get(course_id=course_id)
        
        session = StudySession.objects.create(
            creator=creator,
            course=course,
            **validated_data
        )
        return session


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
