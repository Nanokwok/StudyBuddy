from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    UserViewSet, CourseViewSet, UserCourseViewSet, StudySessionViewSet,
    SessionParticipantViewSet, FriendshipViewSet, SocialMediaLinkViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'enrollments', UserCourseViewSet)
router.register(r'study-sessions', StudySessionViewSet)
router.register(r'session-participants', SessionParticipantViewSet)
router.register(r'friendships', FriendshipViewSet)
router.register(r'social-links', SocialMediaLinkViewSet, basename='social-links')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
]