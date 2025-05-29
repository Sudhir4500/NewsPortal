from django.contrib import admin
from .models import User

# Register your models here.

# add to show isacttive username and email in admin panel
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff')
    search_fields = ('username', 'email')
    list_filter = ('is_active', 'is_staff')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(is_active=True)

admin.site.register(User, UserAdmin)
