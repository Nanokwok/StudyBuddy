from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Course, UserCourse, Friendship, SocialMediaLink


class SocialMediaLinkInline(admin.TabularInline):
    """
    Inline admin for showing/editing social media links in User admin.
    """
    model = SocialMediaLink
    extra = 1


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom admin for User model with extended fields and inlines.
    """
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'email', 'bio', 'profile_picture_url')
        }),
        ('Important dates', {'fields': ('last_login', 'created_at')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )
    readonly_fields = ('created_at', 'last_login')
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'created_at', 'last_login', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-created_at',)
    inlines = [SocialMediaLinkInline]


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """
    Admin for Course model with filters, search, and sorting.
    """
    list_display = ('course_id', 'course_code', 'title', 'subject', 'study_schedules_day', 'study_schedules_time')
    search_fields = ('course_code', 'title', 'subject')
    list_filter = ('subject', 'study_schedules_day')
    ordering = ('-course_id',)


@admin.register(UserCourse)
class UserCourseAdmin(admin.ModelAdmin):
    """
    Admin for UserCourse model (relationship between user and course).
    """
    list_display = ('user_course_id', 'user', 'course', 'enrolled_at')
    search_fields = ('user__username', 'user__email', 'course__course_code')
    autocomplete_fields = ('user', 'course')
    list_filter = ('enrolled_at',)
    ordering = ('-enrolled_at',)


@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    """
    Admin for Friendship model with search, filters, and autocomplete.
    """
    list_display = ('friendship_id', 'requester', 'addressee', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('requester__email', 'addressee__email')
    autocomplete_fields = ('requester', 'addressee')
    ordering = ('-created_at',)


@admin.register(SocialMediaLink)
class SocialMediaLinkAdmin(admin.ModelAdmin):
    """
    Admin for SocialMediaLink model.
    """
    list_display = ('link_id', 'user', 'platform', 'name')
    list_filter = ('platform',)
    search_fields = ('user__email', 'name')
    autocomplete_fields = ('user',)
