import uuid
from django.db import models
from accounts.models import User
from django.utils import timezone
import logging
from django.db.models.signals import pre_save
from django.dispatch import receiver
# from cloudinary.models import CloudinaryField

logger = logging.getLogger(__name__)

class Ad(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='ads/', blank=True, null=True)
    # image = CloudinaryField('image', blank=True, null=True, help_text="Upload an image for the ad. Supported formats: jpg, png, webp.")
    url = models.URLField()
    advertiser = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def refresh_active_status(self):
        # Manually trigger a refresh (for admin use)
        now = timezone.now()
        local_tz = timezone.get_default_timezone()
        now_local = now.astimezone(local_tz)
        start_local = self.start_date.astimezone(local_tz)
        end_local = self.end_date.astimezone(local_tz)
        
        is_active = start_local <= now_local <= end_local
        logger.debug(
            f"Ad {self.title} (ID: {self.id}) refresh_active_status: "
            f"start_date={start_local}, end_date={end_local}, now={now_local}, is_active={is_active}"
        )
        return is_active

@receiver(pre_save, sender=Ad)
def update_ad_activity(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = sender.objects.get(pk=instance.pk)
            if old_instance.end_date != instance.end_date:
                instance.refresh_active_status()  # Update is_active status when end_date changes
                logger.debug(f"End date changed for Ad {instance.title} (ID: {instance.id}) from {old_instance.end_date} to {instance.end_date}")
        except sender.DoesNotExist:
            pass