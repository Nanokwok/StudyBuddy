from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'enrollments', UserCourseViewSet)
router.register(r'friendships', FriendshipViewSet)
router.register(r'social-links', SocialMediaLinkViewSet, basename='social-links')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('users/me/', UserViewSet.as_view({'get': 'me', 'patch': 'partial_update'}), name='user-me'),
    path('users/me/upload_profile_picture/', UserViewSet.as_view({'post': 'upload_profile_picture'}), name='user-profile-picture'),
]