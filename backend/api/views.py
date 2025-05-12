from rest_framework import viewsets, filters, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import pytz
from django.utils.timezone import now
from django.db.models import Q
from .utils.s3_utils import get_full_s3_url
import boto3
import uuid
from botocore.exceptions import ClientError

from .models import *
from .serializers import *

MONDAY = 0
TUESDAY = 1
WEDNESDAY = 2
THURSDAY = 3
FRIDAY = 4
SATURDAY = 5
SUNDAY = 6

HTTP_BAD_REQUEST = status.HTTP_400_BAD_REQUEST
HTTP_CREATED = status.HTTP_201_CREATED
HTTP_NO_CONTENT = status.HTTP_204_NO_CONTENT
HTTP_FORBIDDEN = status.HTTP_403_FORBIDDEN

FRIENDSHIP_PENDING = 'pending'
FRIENDSHIP_ACCEPTED = 'accepted'
FRIENDSHIP_REJECTED = 'rejected'

MAX_UPCOMING_SESSIONS = 3
DAYS_IN_WEEK = 7

DAYS_MAP = {
    'Mon': MONDAY,
    'Tue': TUESDAY,
    'Wed': WEDNESDAY,
    'Thu': THURSDAY,
    'Fri': FRIDAY,
    'Sat': SATURDAY,
    'Sun': SUNDAY
}

class CreateUserView(generics.CreateAPIView):
  """
  View to create a new user
  """
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = [AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=True, methods=['get', 'patch'])
    def courses(self, request, pk=None):
        user = self.get_object()
        user_courses = UserCourse.objects.filter(user=user)
        serializer = UserCourseSerializer(user_courses, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def friendships(self, request, pk=None):
        user = self.get_object()
        sent_requests = Friendship.objects.filter(requester=user, status=FRIENDSHIP_ACCEPTED)
        received_requests = Friendship.objects.filter(addressee=user, status=FRIENDSHIP_ACCEPTED)

        sent_serializer = FriendshipSerializer(sent_requests, many=True)
        received_serializer = FriendshipSerializer(received_requests, many=True)

        return Response({
            'sent_requests': sent_serializer.data,
            'received_requests': received_serializer.data
        })
    
    @action(detail=True, methods=['get', 'patch', 'post'])
    def social_links(self, request, pk=None):
        user = self.get_object()
        links = SocialMediaLink.objects.filter(user=user)
        serializer = SocialMediaLinkSerializer(links, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        if request.method == 'PATCH':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_profile_picture(self, request):
        if 'profile_picture' not in request.FILES:
            return Response(
                {'error': 'No image provided'},
                status=HTTP_BAD_REQUEST
            )

        user = request.user
        image = request.FILES['profile_picture']

        file_extension = image.name.split('.')[-1]
        filename = f"profile_pictures/{user.username}.{file_extension}"
        user.profile_picture_url.save(filename, image, save=True)

        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def friendship_count(self, request, pk=None):
        user = self.get_object()
        sent = Friendship.objects.filter(requester=user, status=FRIENDSHIP_ACCEPTED).count()
        received = Friendship.objects.filter(addressee=user, status=FRIENDSHIP_ACCEPTED).count()
        return Response({'friendship_count': sent + received})

    @action(detail=False, methods=['get'], url_path='pending_friend_requests')
    def pending_friend_requests(self, request):
        user = request.user
        pending = Friendship.objects.filter(addressee=user, status=FRIENDSHIP_PENDING)
        
        data = []
        for f in pending:
            sender = f.requester
            enrolled = UserCourse.objects.filter(user=sender).select_related('course')
            tags = [uc.course.title for uc in enrolled]
            sender_data = UserBasicSerializer(sender).data

            data.append({
                'id': f.friendship_id,
                'name': sender.get_full_name(),
                'bio': sender.bio or '',
                'profile_picture_url': sender_data['profile_picture_url'],
                'tags': tags
            })

        return Response(data)

    @action(detail=False, methods=['post'], url_path='request_friendship')
    def request_friendship(self, request):
        addressee_id = request.data.get('addressee_id')
        requester = request.user
        
        try:
            addressee = User.objects.get(id=addressee_id)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=HTTP_BAD_REQUEST
            )
        
        if requester.id == addressee_id:
            return Response(
                {'detail': 'Cannot send friend request to yourself.'},
                status=HTTP_BAD_REQUEST
            )
        
        friendship = Friendship.objects.create(
            requester=requester,
            addressee_id=addressee_id,
            status=FRIENDSHIP_PENDING
        )
        
        serializer = self.get_serializer(friendship)
        return Response(serializer.data, status=HTTP_CREATED)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['course_code', 'title', 'subject']
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer
    
    @action(detail=True, methods=['get'])
    def enrolled_users(self, request, pk=None):
        course = self.get_object()
        user_courses = UserCourse.objects.filter(course=course)
        serializer = UserCourseSerializer(user_courses, many=True)
        return Response(serializer.data)


class UserCourseViewSet(viewsets.ModelViewSet):
    queryset = UserCourse.objects.all()
    serializer_class = UserCourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserCourse.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def enroll(self, request):
        user_id = request.user.id
        course_code = request.data.get('course_code')
        try:
            course = Course.objects.get(course_code=course_code)
            course_id = course.course_id
        except Course.DoesNotExist:
            return Response(
                {'detail': 'Course not found.'},
                status=HTTP_BAD_REQUEST
            )
        
        if UserCourse.objects.filter(user_id=user_id, course_id=course_id).exists():
            return Response(
                {'detail': 'User is already enrolled in this course.'},
                status=HTTP_BAD_REQUEST
            )
        
        user_course = UserCourse.objects.create(
            user_id=user_id,
            course_id=course_id
        )
        
        serializer = self.get_serializer(user_course)
        return Response(serializer.data, status=HTTP_CREATED)
    
    @action(detail=False, methods=['get'])
    def user_courses(self, request):
        enrollments = UserCourse.objects.filter(user=request.user).select_related('course')
        serializer = UserCourseSerializer(enrollments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def unenroll(self, request):
        user_id = request.user.id
        course_code = request.data.get('course_code')
        try:
            course = Course.objects.get(course_code=course_code)
            course_id = course.course_id
        except Course.DoesNotExist:
            return Response(
                {'detail': 'Course not found.'},
                status=HTTP_BAD_REQUEST
            )
        
        enrollment = get_object_or_404(
            UserCourse, 
            user_id=user_id, 
            course_id=course_id
        )
        enrollment.delete()
        
        return Response(status=HTTP_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='upcoming_sessions')
    def upcoming_sessions(self, request):
        user = request.user
        today = now().date()
        weekday_today = today.weekday()

        enrollments = UserCourse.objects.filter(user=user).select_related('course')

        sessions = []
        for enrollment in enrollments:
            course = enrollment.course
            day_code = course.study_schedules_day
            target_weekday = DAYS_MAP.get(day_code)

            if target_weekday is None:
                continue

            delta_days = (target_weekday - weekday_today + DAYS_IN_WEEK) % DAYS_IN_WEEK
            class_date = today + timedelta(days=delta_days)

            sessions.append({
                'id': course.course_id,
                'title': course.title,
                'date': class_date.strftime('%b %d, %Y'),
                'time': course.study_schedules_time.strftime('%I:%M %p'),
            })

        sessions = sorted(sessions, key=lambda x: datetime.strptime(x['date'], '%b %d, %Y'))[:MAX_UPCOMING_SESSIONS]
        
        return Response(sessions)


class FriendshipViewSet(viewsets.ModelViewSet):
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return FriendshipUpdateSerializer
        return FriendshipSerializer
    
    @action(detail=False, methods=['post'])
    def request_friendship(self, request):
        addressee_id = request.data.get('addressee_id')
        requester = request.user
        
        if Friendship.objects.filter(
            requester=requester,
            addressee_id=addressee_id
        ).exists():
            return Response(
                {'detail': 'Friendship request already exists.'},
                status=HTTP_BAD_REQUEST
            )
        
        friendship = Friendship.objects.create(
            requester=requester,
            addressee_id=addressee_id,
            status=FRIENDSHIP_PENDING
        )
        
        serializer = self.get_serializer(friendship)
        return Response(serializer.data, status=HTTP_CREATED)
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        friendship = self.get_object()
        
        if friendship.addressee != request.user:
            return Response(
                {'detail': 'Only the request recipient can accept the friendship.'},
                status=HTTP_FORBIDDEN
            )
        
        friendship.status = FRIENDSHIP_ACCEPTED
        friendship.save()
        
        serializer = self.get_serializer(friendship)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        friendship = self.get_object()
        
        if friendship.addressee != request.user:
            return Response(
                {'detail': 'Only the request recipient can reject the friendship.'},
                status=HTTP_FORBIDDEN
            )
        
        friendship.status = FRIENDSHIP_REJECTED
        friendship.save()
        
        serializer = self.get_serializer(friendship)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='addable-users')
    def addable_users(self, request):
        user = request.user

        related_ids = Friendship.objects.filter(
            Q(requester=user) | Q(addressee=user)
        ).exclude(status=FRIENDSHIP_REJECTED).values_list('requester', 'addressee')

        excluded_ids = set()
        for pair in related_ids:
            excluded_ids.update(pair)

        candidates = User.objects.exclude(id__in=excluded_ids).exclude(id=user.id)

        data = [
            {
                'id': u.id,
                'name': u.get_full_name(),
                'bio': u.bio,
                'profile_picture_url': UserBasicSerializer(u).data['profile_picture_url'],
                'tags': [uc.course.title for uc in u.usercourse_set.all()],
            }
            for u in candidates
        ]

        return Response(data)
    
    @action(detail=False, methods=['post'], url_path='unfriend')
    def unfriend(self, request):
        friend_id = request.data.get('friend_id')
        if not friend_id:
            return Response(
                {'detail': 'friend_id is required'},
                status=HTTP_BAD_REQUEST
            )

        try:
            friendship = Friendship.objects.filter(
                (Q(requester=request.user, addressee_id=friend_id) |
                Q(addressee=request.user, requester_id=friend_id)),
                status=FRIENDSHIP_ACCEPTED
            ).first()

            if not friendship:
                return Response(
                    {'detail': 'Friendship not found or already removed'},
                    status=HTTP_BAD_REQUEST
                )

            friendship.delete()
            return Response(
                {'detail': 'Successfully unfriended'},
                status=HTTP_NO_CONTENT
            )

        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=HTTP_BAD_REQUEST
            )


class SocialMediaLinkViewSet(viewsets.ModelViewSet):
    serializer_class = SocialMediaLinkSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SocialMediaLink.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        platform = serializer.validated_data.get('platform')
        if platform:
            platform = platform.capitalize()
            serializer.save(user=self.request.user, platform=platform)
        else:
            serializer.save(user=self.request.user)