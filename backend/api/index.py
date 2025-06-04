import os
from django.core.wsgi import get_wsgi_application

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Get WSGI application
application = get_wsgi_application()

# Serverless handler
def handler(environ, start_response):
    return application(environ, start_response)