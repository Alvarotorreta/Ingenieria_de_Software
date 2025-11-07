"""
Serializers para la app users
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Administrator, Professor, Student


class UserSerializer(serializers.ModelSerializer):
    """Serializer para el modelo User de Django"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class AdministratorSerializer(serializers.ModelSerializer):
    """Serializer para Administrador"""
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Administrator
        fields = ['id', 'user', 'user_id', 'is_super_admin', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProfessorSerializer(serializers.ModelSerializer):
    """Serializer para Profesor"""
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Professor
        fields = ['id', 'user', 'user_id', 'access_code', 'full_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class ProfessorCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear un Profesor con User"""
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, validators=[validate_password])
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    access_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Professor
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'access_code']

    def validate_access_code(self, value):
        """Convertir cadena vacía a None"""
        if value == '':
            return None
        return value

    def create(self, validated_data):
        user_data = {
            'username': validated_data.pop('username'),
            'email': validated_data.pop('email'),
            'password': validated_data.pop('password'),
            'first_name': validated_data.pop('first_name', ''),
            'last_name': validated_data.pop('last_name', ''),
        }
        # Asegurar que el usuario se cree como activo
        user = User.objects.create_user(**user_data)
        user.is_active = True
        user.save()
        
        # Manejar access_code
        access_code = validated_data.pop('access_code', None)
        if access_code == '':
            access_code = None
        
        professor = Professor.objects.create(user=user, access_code=access_code, **validated_data)
        return professor


class StudentSerializer(serializers.ModelSerializer):
    """Serializer para Estudiante"""
    class Meta:
        model = Student
        fields = ['id', 'full_name', 'email', 'rut', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentBulkCreateSerializer(serializers.Serializer):
    """Serializer para crear múltiples estudiantes desde un Excel"""
    students = StudentSerializer(many=True)

    def create(self, validated_data):
        students_data = validated_data['students']
        students = []
        for student_data in students_data:
            student, created = Student.objects.get_or_create(
                email=student_data['email'],
                defaults=student_data
            )
            students.append(student)
        return {'students': students}

