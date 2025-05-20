from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

# 🔐 Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'bio', 'profile_picture')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

# 🔑 JWT Token Serializer (uses email instead of username)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        return token

    def validate(self, attrs):
        # Allow email login instead of username
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Update the username field to use email for authentication
            attrs['username'] = email  # Map email to username for Django auth
            data = super().validate(attrs)  # Validate credentials and get tokens
            # Ensure the user is stored in the serializer instance
            self.user = self.user or self.context['request'].user
            return data
        else:
            raise serializers.ValidationError(
                'Must include "email" and "password".',
                code='authorization'
            )

# 👤 User Detail Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'bio', 'profile_picture', 'date_joined', 'is_staff')