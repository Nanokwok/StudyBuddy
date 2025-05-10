from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *


class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('username', 'email')
    filter_horizontal = ('groups', 'user_permissions')


class UserCourseInline(admin.TabularInline):
    model = UserCourse
    extra = 0


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_code', 'title', 'subject')
    search_fields = ('course_code', 'title')
    inlines = [UserCourseInline]


@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display = ('requester', 'addressee', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('requester__email', 'addressee__email')


@admin.register(SocialMediaLink)
class SocialMediaLinkAdmin(admin.ModelAdmin):
    list_display = ('user', 'platform', 'name')
    search_fields = ('user__email', 'platform')


admin.site.register(User, CustomUserAdmin)
admin.site.register(UserCourse)
