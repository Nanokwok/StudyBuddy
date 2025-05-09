from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from .models import (
    User, Course, UserCourse, StudySession, 
    SessionParticipant, Friendship, SocialMediaLink
)
from .serializers import (
    UserSerializer, UserBasicSerializer, CourseSerializer, CourseDetailSerializer,
    UserCourseSerializer, StudySessionListSerializer, StudySessionDetailSerializer,
    SessionParticipantSerializer, FriendshipSerializer, FriendshipUpdateSerializer,
    SocialMediaLinkSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=True, methods=['get'])
    def courses(self, request, pk=None):
        user = self.get_object()
        user_courses = UserCourse.objects.filter(user=user)
        serializer = UserCourseSerializer(user_courses, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def study_sessions(self, request, pk=None):
        user = self.get_object()
        # Get sessions created by the user
        created_sessions = StudySession.objects.filter(creator=user)
        # Get sessions the user is participating in
        participating_sessions = StudySession.objects.filter(
            participants__user=user
        ).exclude(creator=user)
        
        created_serializer = StudySessionListSerializer(created_sessions, many=True)
        participating_serializer = StudySessionListSerializer(participating_sessions, many=True)
        
        return Response({
            'created_sessions': created_serializer.data,
            'participating_sessions': participating_serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def friendships(self, request, pk=None):
        user = self.get_object()
        # Get friendships where the user is the requester
        sent_requests = Friendship.objects.filter(requester=user)
        # Get friendships where the user is the addressee
        received_requests = Friendship.objects.filter(addressee=user)
        
        sent_serializer = FriendshipSerializer(sent_requests, many=True)
        received_serializer = FriendshipSerializer(received_requests, many=True)
        
        return Response({
            'sent_requests': sent_serializer.data,
            'received_requests': received_serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def social_links(self, request, pk=None):
        user = self.get_object()
        links = SocialMediaLink.objects.filter(user=user)
        serializer = SocialMediaLinkSerializer(links, many=True)
        return Response(serializer.data)


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
    
    @action(detail=True, methods=['get'])
    def study_sessions(self, request, pk=None):
        course = self.get_object()
        sessions = StudySession.objects.filter(course=course)
        serializer = StudySessionListSerializer(sessions, many=True)
        return Response(serializer.data)


class UserCourseViewSet(viewsets.ModelViewSet):
    queryset = UserCourse.objects.all()
    serializer_class = UserCourseSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def enroll(self, request):
        user_id = request.user.id
        course_id = request.data.get('course_id')
        
        # Check if enrollment already exists
        if UserCourse.objects.filter(user_id=user_id, course_id=course_id).exists():
            return Response(
                {'detail': 'User is already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create new enrollment
        user_course = UserCourse.objects.create(
            user_id=user_id,
            course_id=course_id
        )
        
        serializer = self.get_serializer(user_course)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def unenroll(self, request):
        user_id = request.user.id
        course_id = request.data.get('course_id')
        
        enrollment = get_object_or_404(
            UserCourse, 
            user_id=user_id, 
            course_id=course_id
        )
        enrollment.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudySessionViewSet(viewsets.ModelViewSet):
    queryset = StudySession.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'location']
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return StudySessionDetailSerializer
        return StudySessionListSerializer
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        session = self.get_object()
        participants = SessionParticipant.objects.filter(session=session)
        serializer = SessionParticipantSerializer(participants, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        session = self.get_object()
        user = request.user
        
        # Check if user is already a participant
        if SessionParticipant.objects.filter(session=session, user=user).exists():
            return Response(
                {'detail': 'User is already a participant in this session.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create participant
        participant = SessionParticipant.objects.create(
            session=session,
            user=user
        )
        
        serializer = SessionParticipantSerializer(participant)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        session = self.get_object()
        user = request.user
        
        participant = get_object_or_404(
            SessionParticipant,
            session=session,
            user=user
        )
        participant.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


class SessionParticipantViewSet(viewsets.ModelViewSet):
    queryset = SessionParticipant.objects.all()
    serializer_class = SessionParticipantSerializer
    permission_classes = [IsAuthenticated]


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
        
        # Check if friendship request already exists
        if Friendship.objects.filter(
            requester=requester,
            addressee_id=addressee_id
        ).exists():
            return Response(
                {'detail': 'Friendship request already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create friendship request
        friendship = Friendship.objects.create(
            requester=requester,
            addressee_id=addressee_id,
            status='pending'
        )
        
        serializer = self.get_serializer(friendship)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        friendship = self.get_object()
        
        # Ensure the current user is the addressee
        if friendship.addressee != request.user:
            return Response(
                {'detail': 'Only the request recipient can accept the friendship.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        friendship.status = 'accepted'
        friendship.save()
        
        serializer = self.get_serializer(friendship)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        friendship = self.get_object()
        
        # Ensure the current user is the addressee
        if friendship.addressee != request.user:
            return Response(
                {'detail': 'Only the request recipient can reject the friendship.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        friendship.status = 'rejected'
        friendship.save()
        
        serializer = self.get_serializer(friendship)
        return Response(serializer.data)


class SocialMediaLinkViewSet(viewsets.ModelViewSet):
    serializer_class = SocialMediaLinkSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return social media links for the current user
        return SocialMediaLink.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)