"""
Views para la app users
"""
import pandas as pd
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from .models import Administrator, Professor, Student
from .serializers import (
    UserSerializer, AdministratorSerializer, ProfessorSerializer,
    ProfessorCreateSerializer, StudentSerializer, StudentBulkCreateSerializer
)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para ver usuarios (solo lectura)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Obtener información del usuario actual"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class AdministratorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Administradores
    """
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer
    permission_classes = [IsAdminUser]


class ProfessorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Profesores
    """
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

    def get_permissions(self):
        """
        Permite registro público (create) sin autenticación
        pero requiere autenticación para otras acciones
        """
        if self.action == 'create':
            permission_classes = []
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'create':
            return ProfessorCreateSerializer
        return ProfessorSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Obtener información del profesor actual"""
        try:
            professor = request.user.professor
            serializer = self.get_serializer(professor)
            return Response(serializer.data)
        except Professor.DoesNotExist:
            return Response(
                {'error': 'El usuario no es un profesor'},
                status=status.HTTP_404_NOT_FOUND
            )


class StudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Estudiantes
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Crear múltiples estudiantes desde un Excel"""
        serializer = StudentBulkCreateSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.create(serializer.validated_data)
            return Response(result, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def upload_excel(self, request):
        """
        Subir archivo Excel y crear estudiantes automáticamente
        
        Formato esperado del Excel:
        - Correo: correo electrónico del estudiante
        - RUT: RUT del estudiante
        - Nombre: nombre del estudiante
        - Apellido Paterno: apellido paterno
        - Apellido Materno: apellido materno
        """
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No se proporcionó ningún archivo'},
                status=status.HTTP_400_BAD_REQUEST
            )

        excel_file = request.FILES['file']
        
        # Validar extensión del archivo
        if not excel_file.name.endswith(('.xlsx', '.xls')):
            return Response(
                {'error': 'El archivo debe ser un Excel (.xlsx o .xls)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Leer el archivo Excel
            df = pd.read_excel(excel_file)
            
            # Validar columnas requeridas
            required_columns = ['Correo', 'RUT', 'Nombre', 'Apellido Paterno', 'Apellido Materno']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                return Response(
                    {
                        'error': f'Faltan las siguientes columnas en el Excel: {", ".join(missing_columns)}',
                        'columnas_requeridas': required_columns,
                        'columnas_encontradas': df.columns.tolist()
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Procesar cada fila
            students_created = []
            students_updated = []
            errors = []
            
            for index, row in df.iterrows():
                try:
                    # Combinar nombre completo
                    nombre = str(row['Nombre']).strip() if pd.notna(row['Nombre']) else ''
                    apellido_paterno = str(row['Apellido Paterno']).strip() if pd.notna(row['Apellido Paterno']) else ''
                    apellido_materno = str(row['Apellido Materno']).strip() if pd.notna(row['Apellido Materno']) else ''
                    
                    # Combinar nombre completo
                    full_name_parts = [part for part in [nombre, apellido_paterno, apellido_materno] if part]
                    full_name = ' '.join(full_name_parts)
                    
                    # Obtener email y RUT
                    email = str(row['Correo']).strip() if pd.notna(row['Correo']) else ''
                    rut = str(row['RUT']).strip() if pd.notna(row['RUT']) else ''
                    
                    # Validar campos requeridos
                    if not email:
                        errors.append(f'Fila {index + 2}: Correo vacío')
                        continue
                    if not rut:
                        errors.append(f'Fila {index + 2}: RUT vacío')
                        continue
                    if not full_name:
                        errors.append(f'Fila {index + 2}: Nombre completo vacío')
                        continue
                    
                    # Crear o actualizar estudiante
                    student, created = Student.objects.update_or_create(
                        email=email,
                        defaults={
                            'full_name': full_name,
                            'rut': rut,
                        }
                    )
                    
                    if created:
                        students_created.append({
                            'id': student.id,
                            'full_name': student.full_name,
                            'email': student.email,
                            'rut': student.rut
                        })
                    else:
                        students_updated.append({
                            'id': student.id,
                            'full_name': student.full_name,
                            'email': student.email,
                            'rut': student.rut
                        })
                        
                except Exception as e:
                    errors.append(f'Fila {index + 2}: {str(e)}')
                    continue
            
            # Preparar respuesta
            response_data = {
                'total_filas': len(df),
                'estudiantes_creados': len(students_created),
                'estudiantes_actualizados': len(students_updated),
                'errores': len(errors),
                'detalle_errores': errors[:10] if errors else [],  # Limitar a 10 errores
            }
            
            if errors:
                response_data['mensaje'] = f'Se procesaron {len(df)} filas. {len(students_created)} creados, {len(students_updated)} actualizados, {len(errors)} errores.'
            else:
                response_data['mensaje'] = f'Se procesaron {len(df)} filas correctamente. {len(students_created)} creados, {len(students_updated)} actualizados.'
            
            status_code = status.HTTP_201_CREATED if students_created or students_updated else status.HTTP_400_BAD_REQUEST
            return Response(response_data, status=status_code)
            
        except pd.errors.EmptyDataError:
            return Response(
                {'error': 'El archivo Excel está vacío'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except pd.errors.ParserError as e:
            return Response(
                {'error': f'Error al leer el archivo Excel: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Error inesperado al procesar el archivo: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
