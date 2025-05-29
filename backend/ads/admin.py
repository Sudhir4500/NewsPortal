import logging
from django.contrib import admin
from .models import Ad

logger = logging.getLogger(__name__)

@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ['title', 'advertiser', 'start_date', 'end_date', 'created_at', 'refresh_status']
    list_filter = ['start_date', 'end_date']
    search_fields = ['title']

    def refresh_status(self, obj):
        return obj.refresh_active_status()
    refresh_status.short_description = 'Is Active (Refresh)'

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # Force refresh after save
        obj.refresh_active_status()
        logger.debug(f"Refreshed status for Ad {obj.title} (ID: {obj.id}) after save")