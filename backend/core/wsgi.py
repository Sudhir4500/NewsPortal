"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from serverless_wsgi import handle_request

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()
# This WSGI configuration is used to serve the Django application in production.
app = application  # For compatibility with some WSGI servers that expect 'app' to be the callable.


def handler(event, context):
    return handle_request(application, event, context)
