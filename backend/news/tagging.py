from django.db import models
from taggit.models import TagBase, GenericUUIDTaggedItemBase

class CustomTag(TagBase):
    # You can extend if you want, or just inherit as is.
    pass

class CustomUUIDTaggedItem(GenericUUIDTaggedItemBase):
    tag = models.ForeignKey(
        CustomTag,
        related_name="custom_tagged_items",
        on_delete=models.CASCADE,
    )
