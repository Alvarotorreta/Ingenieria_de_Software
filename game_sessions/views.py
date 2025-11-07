"""
Views para la app game_sessions
"""
import pandas as pd
import random
import string
import qrcode
from io import BytesIO
import base64
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os
from PIL import Image
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from users.models import Professor, Student
from .models import (
    GameSession, Team, TeamStudent, TeamPersonalization, SessionStage,
    TeamActivityProgress, TeamBubbleMap, Tablet, TabletConnection,
    TeamRouletteAssignment, TokenTransaction, PeerEvaluation
)
from .serializers import (
    GameSessionSerializer, GameSessionCreateSerializer,
    TeamSerializer, TeamPersonalizationSerializer,
    SessionStageSerializer, TeamActivityProgressSerializer,
    TeamBubbleMapSerializer, TabletSerializer, TabletConnectionSerializer,
    TeamRouletteAssignmentSerializer, TokenTransactionSerializer,
    PeerEvaluationSerializer
)
from users.models import Student


class GameSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Sesiones de Juego
    """
    queryset = GameSession.objects.all()
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """
        Permite leer sin autenticación para tablets
        También permite acceso sin autenticación a acciones personalizadas para tablets
        """
        # Acciones estándar que no requieren autenticación
        if self.action in ['retrieve', 'list']:
            return [AllowAny()]
        # Acciones personalizadas que no requieren autenticación (para tablets)
        if self.action in ['lobby', 'activity_timer', 'stage_results']:
            return [AllowAny()]
        return super().get_permissions()
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['professor', 'course', 'status']
    search_fields = ['room_code', 'professor__user__username', 'course__name']
    ordering_fields = ['created_at', 'started_at', 'status']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return GameSessionCreateSerializer
        return GameSessionSerializer

    def get_queryset(self):
        queryset = GameSession.objects.select_related('professor__user', 'course', 'current_stage', 'current_activity')
        # Profesores solo ven sus propias sesiones (solo si están autenticados)
        if self.request.user.is_authenticated and hasattr(self.request.user, 'professor'):
            queryset = queryset.filter(professor__user=self.request.user)
        return queryset

    def _generate_room_code(self):
        """Generar código de sala único (6 caracteres alfanuméricos)"""
        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            if not GameSession.objects.filter(room_code=code).exists():
                return code

    def _generate_qr_code(self, room_code, base_url='http://localhost:8000'):
        """Generar código QR para la sala"""
        qr_url = f"{base_url}/tablet/join/{room_code}"
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(qr_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convertir imagen a base64
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return f"data:image/png;base64,{img_str}"

    def _create_teams_automatically(self, game_session, students, min_size=3, max_size=8):
        """
        Crear equipos automáticamente con estudiantes
        
        Args:
            game_session: Sesión de juego
            students: Lista de estudiantes
            min_size: Tamaño mínimo por equipo (default: 3)
            max_size: Tamaño máximo por equipo (default: 8)
        
        Returns:
            Lista de equipos creados
        """
        if not students:
            return []
        
        # Colores disponibles para equipos
        team_colors = ['Verde', 'Azul', 'Rojo', 'Amarillo', 'Naranja', 'Morado', 'Rosa', 'Cian', 'Gris', 'Marrón']
        
        # Mezclar estudiantes aleatoriamente
        shuffled_students = list(students)
        random.shuffle(shuffled_students)
        
        total_students = len(shuffled_students)
        
        # Validar que haya suficientes estudiantes
        if total_students < min_size:
            # Si hay menos estudiantes que el mínimo, crear un solo equipo con todos
            num_teams = 1
        else:
            # Calcular número óptimo de equipos
            # Intentar crear equipos de tamaño óptimo (entre min_size y max_size)
            # Calcular cuántos equipos podemos hacer con el tamaño máximo
            num_teams_max = (total_students + max_size - 1) // max_size  # División entera hacia arriba
            
            # Calcular cuántos equipos podemos hacer con el tamaño mínimo
            num_teams_min = total_students // min_size
            
            # Elegir el número de equipos que mejor distribuya los estudiantes
            # Preferir más equipos si es posible, pero asegurando que todos tengan al menos min_size
            num_teams = min(num_teams_max, num_teams_min)
            if num_teams == 0:
                num_teams = 1
        
        # Calcular tamaño base de cada equipo
        base_team_size = total_students // num_teams
        remainder = total_students % num_teams  # Estudiantes restantes a distribuir
        
        teams = []
        student_index = 0
        
        for i in range(num_teams):
            # Calcular tamaño del equipo actual
            # Distribuir estudiantes restantes en los primeros equipos
            current_team_size = base_team_size + (1 if i < remainder else 0)
            
            # Asegurar que el tamaño esté dentro del rango
            current_team_size = max(min_size, min(max_size, current_team_size))
            
            # Obtener estudiantes para este equipo
            team_students = shuffled_students[student_index:student_index + current_team_size]
            student_index += current_team_size
            
            # Crear equipo
            color = team_colors[i % len(team_colors)]
            team = Team.objects.create(
                game_session=game_session,
                name=f"Equipo {color}",
                color=color
            )
            
            # Asignar estudiantes al equipo
            for student in team_students:
                TeamStudent.objects.create(team=team, student=student)
            
            teams.append(team)
        
        return teams

    @action(detail=False, methods=['post'])
    def create_with_excel(self, request):
        """
        Crear sesión de juego con archivo Excel y asignación automática de equipos
        
        Requiere:
        - course_id: ID del curso
        - file: Archivo Excel con estudiantes
        - min_team_size (opcional): Tamaño mínimo por equipo (default: 3)
        - max_team_size (opcional): Tamaño máximo por equipo (default: 8)
        """
        # Validar que el usuario es profesor
        try:
            professor = request.user.professor
        except Professor.DoesNotExist:
            return Response(
                {'error': 'El usuario no es un profesor'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar si el profesor ya tiene una sesión activa (lobby o running)
        active_session = GameSession.objects.filter(
            professor=professor,
            status__in=['lobby', 'running']
        ).first()
        
        if active_session:
            return Response(
                {
                    'error': 'Ya tienes una sesión activa',
                    'active_session_id': active_session.id,
                    'active_session_room_code': active_session.room_code,
                    'active_session_status': active_session.status,
                    'message': 'Debes finalizar o cancelar la sesión actual antes de crear una nueva'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar curso
        course_id = request.data.get('course_id')
        if not course_id:
            return Response(
                {'error': 'Se requiere course_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from academic.models import Course
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {'error': 'Curso no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validar archivo Excel
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No se proporcionó ningún archivo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        excel_file = request.FILES['file']
        
        if not excel_file.name.endswith(('.xlsx', '.xls')):
            return Response(
                {'error': 'El archivo debe ser un Excel (.xlsx o .xls)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener parámetros de tamaño de equipo
        min_team_size = int(request.data.get('min_team_size', 3))
        max_team_size = int(request.data.get('max_team_size', 8))
        
        try:
            # Leer y procesar Excel
            df = pd.read_excel(excel_file)
            
            # Validar columnas
            required_columns = ['Correo', 'RUT', 'Nombre', 'Apellido Paterno', 'Apellido Materno']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                return Response(
                    {
                        'error': f'Faltan las siguientes columnas: {", ".join(missing_columns)}',
                        'columnas_requeridas': required_columns,
                        'columnas_encontradas': df.columns.tolist()
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Procesar estudiantes
            students_list = []
            errors = []
            
            for index, row in df.iterrows():
                try:
                    # Combinar nombre completo
                    nombre = str(row['Nombre']).strip() if pd.notna(row['Nombre']) else ''
                    apellido_paterno = str(row['Apellido Paterno']).strip() if pd.notna(row['Apellido Paterno']) else ''
                    apellido_materno = str(row['Apellido Materno']).strip() if pd.notna(row['Apellido Materno']) else ''
                    
                    full_name_parts = [part for part in [nombre, apellido_paterno, apellido_materno] if part]
                    full_name = ' '.join(full_name_parts)
                    
                    email = str(row['Correo']).strip() if pd.notna(row['Correo']) else ''
                    rut = str(row['RUT']).strip() if pd.notna(row['RUT']) else ''
                    
                    if not email or not rut or not full_name:
                        errors.append(f'Fila {index + 2}: Datos incompletos')
                        continue
                    
                    # Obtener o crear estudiante
                    student, created = Student.objects.get_or_create(
                        email=email,
                        defaults={
                            'full_name': full_name,
                            'rut': rut,
                        }
                    )
                    students_list.append(student)
                    
                except Exception as e:
                    errors.append(f'Fila {index + 2}: {str(e)}')
                    continue
            
            if not students_list:
                return Response(
                    {'error': 'No se pudieron procesar estudiantes del archivo Excel'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Crear sesión de juego
            room_code = self._generate_room_code()
            qr_code = self._generate_qr_code(room_code)
            
            game_session = GameSession.objects.create(
                professor=professor,
                course=course,
                room_code=room_code,
                qr_code=qr_code,
                status='lobby'
            )
            
            # Crear equipos automáticamente
            teams = self._create_teams_automatically(
                game_session,
                students_list,
                min_size=min_team_size,
                max_size=max_team_size
            )
            
            # Serializar respuesta
            serializer = GameSessionSerializer(game_session)
            team_serializer = TeamSerializer(teams, many=True)
            
            return Response({
                'game_session': serializer.data,
                'teams': team_serializer.data,
                'students_processed': len(students_list),
                'teams_created': len(teams),
                'errors': errors[:10] if errors else [],
                'message': f'Sesión creada exitosamente. {len(students_list)} estudiantes procesados, {len(teams)} equipos creados.'
            }, status=status.HTTP_201_CREATED)
            
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
                {'error': f'Error inesperado: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Iniciar una sesión de juego"""
        try:
            # Obtener sesión directamente sin usar get_object() para evitar verificación de permisos
            try:
                game_session = GameSession.objects.get(id=pk)
            except GameSession.DoesNotExist:
                return Response(
                    {'error': 'Sesión no encontrada'},
                    status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            import traceback
            print(f"Error en start al obtener objeto: {e}")
            print(traceback.format_exc())
            return Response(
                {'error': f'Error al obtener sesión: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        if game_session.status != 'lobby':
            return Response(
                {'error': 'La sesión no está en estado lobby'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que todas las tablets estén conectadas
        teams = game_session.teams.all()
        all_teams_connected = all(
            team.tablet_connections.filter(disconnected_at__isnull=True).exists()
            for team in teams
        )
        
        if not all_teams_connected:
            connected_teams = sum(1 for team in teams if team.tablet_connections.filter(disconnected_at__isnull=True).exists())
            return Response(
                {
                    'error': 'No se puede iniciar el juego. Todas las tablets deben estar conectadas.',
                    'teams_connected': connected_teams,
                    'total_teams': teams.count()
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Establecer la primera etapa y actividad si no están establecidas
        if not game_session.current_stage:
            from challenges.models import Stage, Activity, ActivityType
            # Obtener la primera etapa (solo activas)
            first_stage = Stage.objects.filter(is_active=True).order_by('number').first()
            if first_stage:
                game_session.current_stage = first_stage
                # Obtener la primera actividad de la etapa (Personalización)
                try:
                    personalization_type = ActivityType.objects.get(name='Personalización')
                    first_activity = Activity.objects.filter(
                        stage=first_stage,
                        activity_type=personalization_type,
                        is_active=True
                    ).order_by('order_number').first()
                    if first_activity:
                        game_session.current_activity = first_activity
                except ActivityType.DoesNotExist:
                    # Si no existe el tipo, tomar la primera actividad de la etapa
                    first_activity = Activity.objects.filter(
                        stage=first_stage,
                        is_active=True
                    ).order_by('order_number').first()
                    if first_activity:
                        game_session.current_activity = first_activity
                except Exception as e:
                    # Log del error pero continuar
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.warning(f'Error al establecer actividad: {e}')
        
        game_session.status = 'running'
        game_session.started_at = timezone.now()
        
        # Guardar cambios (incluyendo current_stage y current_activity si se establecieron)
        game_session.save()
        
        # Inicializar started_at para todos los equipos en la primera actividad
        if game_session.current_activity:
            # Verificar que current_stage no sea None
            if not game_session.current_stage:
                return Response(
                    {'error': 'No se puede iniciar el juego. La etapa no está establecida.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            activity_start_time = timezone.now()
            from .models import Team, TeamActivityProgress, SessionStage
            teams = Team.objects.filter(game_session=game_session)
            
            # Crear SessionStage para esta etapa si no existe
            # Usar get_or_create que maneja automáticamente los casos de existencia
            try:
                session_stage, created = SessionStage.objects.get_or_create(
                    game_session=game_session,
                    stage=game_session.current_stage,
                    defaults={
                        'status': 'in_progress',
                        'started_at': activity_start_time
                    }
                )
            except Exception as e:
                # Si get_or_create falla, intentar obtener el objeto existente
                import logging
                logger = logging.getLogger(__name__)
                logger.warning(f'Error en get_or_create: {e}. Intentando obtener objeto existente.')
                try:
                    session_stage = SessionStage.objects.get(
                        game_session=game_session,
                        stage=game_session.current_stage
                    )
                    created = False
                except SessionStage.DoesNotExist:
                    # Si no existe, devolver error
                    return Response(
                        {'error': f'No se pudo crear SessionStage: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            # Si no se creó nuevo, actualizar el status y started_at si es necesario
            if not created:
                session_stage.status = 'in_progress'
                if not session_stage.started_at:
                    session_stage.started_at = activity_start_time
                session_stage.save(update_fields=['status', 'started_at'])
            
            # Intentar establecer presentation_state si existe (después de guardar)
            try:
                if hasattr(session_stage, 'presentation_state') and not session_stage.presentation_state:
                    # Solo establecer si no tiene valor
                    SessionStage.objects.filter(id=session_stage.id).update(presentation_state='not_started')
                    session_stage.refresh_from_db()
            except Exception:
                # Si falla, no importa, el objeto ya está guardado
                pass
            
            # Inicializar started_at para todos los equipos en la primera actividad
            for team in teams:
                progress, created = TeamActivityProgress.objects.get_or_create(
                    team=team,
                    activity=game_session.current_activity,
                    session_stage=session_stage,
                    defaults={
                        'status': 'pending',
                        'started_at': activity_start_time
                    }
                )
                # SIEMPRE actualizar el started_at para sincronizar
                if not created:
                    progress.started_at = activity_start_time
                    progress.save()
        
        # Recargar desde la BD para asegurar que los campos relacionados estén disponibles
        game_session.refresh_from_db()
        
        # Seleccionar campos relacionados explícitamente
        try:
            # Refrescar la sesión para asegurar que todos los campos estén actualizados
            game_session.refresh_from_db()
            
            # Intentar obtener con select_related, pero si falla, usar el objeto que ya tenemos
            try:
                game_session = GameSession.objects.select_related(
                    'current_stage', 'current_activity'
                ).get(id=game_session.id)
            except GameSession.DoesNotExist:
                # Si no existe, usar el objeto que ya tenemos
                pass
            
            serializer = self.get_serializer(game_session)
            return Response(serializer.data)
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"Error en start al serializar: {e}")
            print(error_trace)
            
            # Intentar devolver al menos información básica de la sesión
            try:
                game_session.refresh_from_db()
                return Response({
                    'id': game_session.id,
                    'status': game_session.status,
                    'room_code': game_session.room_code,
                    'error': f'Error al serializar respuesta completa: {str(e)}',
                    'trace': error_trace
                })
            except Exception:
                return Response(
                    {'error': f'Error al serializar respuesta: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

    @action(detail=True, methods=['post'])
    def next_activity(self, request, pk=None):
        """
        Avanzar a la siguiente actividad de la etapa actual
        """
        game_session = self.get_object()
        
        if game_session.status != 'running':
            return Response(
                {'error': 'La sesión debe estar en estado running'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not game_session.current_stage:
            return Response(
                {'error': 'No hay etapa actual establecida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not game_session.current_activity:
            return Response(
                {'error': 'No hay actividad actual establecida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from challenges.models import Activity
        
        # Buscar la siguiente actividad en la misma etapa
        current_order = game_session.current_activity.order_number
        
        # En Etapa 2: Si estamos en "Seleccionar Tema" (orden 1), saltar "Ver Desafío" (orden 2) 
        # y ir directo a "Bubble Map"
        if game_session.current_stage.number == 2 and current_order == 1:
            # Buscar Bubble Map por nombre (más robusto que asumir orden 3)
            from django.db.models import Q
            bubble_map_activity = Activity.objects.filter(
                stage=game_session.current_stage,
                is_active=True
            ).filter(
                Q(name__icontains='bubble') | 
                Q(name__icontains='mapa') | 
                Q(name__icontains='mapa mental') |
                Q(name__icontains='bubblemap')
            ).filter(
                order_number__gt=current_order
            ).order_by('order_number').first()
            
            if bubble_map_activity:
                next_activity = bubble_map_activity
            else:
                # Si no se encuentra por nombre, intentar orden 3
                next_activity = Activity.objects.filter(
                    stage=game_session.current_stage,
                    order_number=3,
                    is_active=True
                ).first()
                
                # Si tampoco existe orden 3, buscar la siguiente actividad normalmente
                if not next_activity:
                    next_activity = Activity.objects.filter(
                        stage=game_session.current_stage,
                        order_number__gt=current_order,
                        is_active=True
                    ).order_by('order_number').first()
        else:
            # Para otras etapas o situaciones, buscar la siguiente actividad normalmente
            next_activity = Activity.objects.filter(
                stage=game_session.current_stage,
                order_number__gt=current_order,
                is_active=True
            ).order_by('order_number').first()
        
        # Si no hay más actividades en esta etapa, marcar etapa como completada y retornar resultados
        if not next_activity:
            # Marcar la actividad actual como completada para todos los equipos antes de completar la etapa
            from .models import SessionStage, Team, TeamActivityProgress
            session_stage = SessionStage.objects.filter(
                game_session=game_session,
                stage=game_session.current_stage
            ).first()
            
            if session_stage:
                # Marcar la actividad actual como completada para todos los equipos
                current_activity = game_session.current_activity
                if current_activity:
                    teams = Team.objects.filter(game_session=game_session)
                    for team in teams:
                        progress, created = TeamActivityProgress.objects.get_or_create(
                            team=team,
                            activity=current_activity,
                            session_stage=session_stage,
                            defaults={
                                'status': 'completed',
                                'progress_percentage': 100,
                                'completed_at': timezone.now()
                            }
                        )
                        if not created:
                            # Si ya existía, actualizar a completado
                            progress.status = 'completed'
                            progress.progress_percentage = 100
                            if not progress.completed_at:
                                progress.completed_at = timezone.now()
                            progress.save()
                
                # Marcar la etapa como completada
                session_stage.status = 'completed'
                session_stage.completed_at = timezone.now()
                session_stage.save()
            
            # Limpiar current_activity para indicar que estamos en resultados
            game_session.current_activity = None
            game_session.save()
            
            # Retornar información de que se completó la etapa
            return Response({
                'stage_completed': True,
                'stage_id': game_session.current_stage.id,
                'stage_name': game_session.current_stage.name,
                'stage_number': game_session.current_stage.number,
                'message': f'Etapa {game_session.current_stage.number} completada. Mostrando resultados...'
            })
        
        # Marcar la actividad actual como completada antes de avanzar a la siguiente
        from .models import SessionStage, Team, TeamActivityProgress
        session_stage = SessionStage.objects.filter(
            game_session=game_session,
            stage=game_session.current_stage
        ).first()
        
        if session_stage:
            current_activity = game_session.current_activity
            if current_activity:
                teams = Team.objects.filter(game_session=game_session)
                for team in teams:
                    progress, created = TeamActivityProgress.objects.get_or_create(
                        team=team,
                        activity=current_activity,
                        session_stage=session_stage,
                        defaults={
                            'status': 'completed',
                            'progress_percentage': 100,
                            'completed_at': timezone.now()
                        }
                    )
                    if not created:
                        # Si ya existía, actualizar a completado
                        progress.status = 'completed'
                        progress.progress_percentage = 100
                        if not progress.completed_at:
                            progress.completed_at = timezone.now()
                        progress.save()
        
        # Actualizar actividad actual
        game_session.current_activity = next_activity
        game_session.save()
        
        # Crear o actualizar SessionStage si no existe
        from .models import SessionStage
        session_stage, created = SessionStage.objects.get_or_create(
            game_session=game_session,
            stage=game_session.current_stage,
            defaults={
                'status': 'in_progress',
                'started_at': timezone.now()
            }
        )
        
        # Inicializar started_at para todos los equipos cuando cambia la actividad
        # Esto asegura que todos los temporizadores estén sincronizados
        activity_start_time = timezone.now()
        from .models import Team, TeamActivityProgress
        teams = Team.objects.filter(game_session=game_session)
        for team in teams:
            progress, created = TeamActivityProgress.objects.get_or_create(
                team=team,
                activity=next_activity,
                session_stage=session_stage,
                defaults={
                    'status': 'pending',
                    'started_at': activity_start_time  # Mismo tiempo para todos
                }
            )
            # SIEMPRE actualizar el started_at para sincronizar (incluso si ya existía)
            if not created:
                progress.started_at = activity_start_time
                if progress.status == 'completed':
                    # Si ya estaba completado, mantener el estado pero actualizar started_at
                    pass
                else:
                    progress.status = 'pending'
                progress.save()
        
        game_session.refresh_from_db()
        game_session = GameSession.objects.select_related(
            'current_stage', 'current_activity'
        ).get(id=game_session.id)
        
        serializer = self.get_serializer(game_session)
        return Response({
            **serializer.data,
            'message': f'Actividad actualizada a: {next_activity.name}',
            'activity_started_at': activity_start_time.isoformat() if activity_start_time else None,
            'current_activity_id': next_activity.id,
            'current_activity_name': next_activity.name,
            'current_activity_order_number': next_activity.order_number
        })

    @action(detail=True, methods=['post'], parser_classes=[JSONParser])
    def complete_stage(self, request, pk=None):
        """
        Completar manualmente la etapa actual (usado cuando el profesor va a resultados)
        Esto limpia current_activity y marca la etapa como completada
        """
        print(f'🎯 [Backend complete_stage] INICIANDO - Session ID: {pk}')
        print(f'   - Timestamp: {timezone.now().isoformat()}')
        print(f'   - Request data: {request.data}')
        
        game_session = self.get_object()
        
        print(f'📊 [Backend complete_stage] Estado inicial del juego:', {
            'session_id': game_session.id,
            'status': game_session.status,
            'current_stage_id': game_session.current_stage.id if game_session.current_stage else None,
            'current_stage_number': game_session.current_stage.number if game_session.current_stage else None,
            'current_activity_id': game_session.current_activity.id if game_session.current_activity else None,
            'current_activity_name': game_session.current_activity.name if game_session.current_activity else None
        })
        
        if game_session.status != 'running':
            print(f'❌ [Backend complete_stage] Error: Sesión no está en estado running')
            return Response(
                {'error': 'La sesión debe estar en estado running'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not game_session.current_stage:
            print(f'❌ [Backend complete_stage] Error: No hay etapa actual')
            return Response(
                {'error': 'No hay etapa actual establecida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        stage_id = request.data.get('stage_id')
        # Aceptar tanto stage_id (ID numérico) como stage_number (número de etapa)
        stage_number = request.data.get('stage_number')
        
        # Si se envía stage_number, verificar que coincida con el número de etapa actual
        if stage_number:
            if game_session.current_stage.number != stage_number:
                print(f'❌ [Backend complete_stage] Error: stage_number no coincide')
                print(f'   - stage_number recibido: {stage_number}')
                print(f'   - current_stage.number: {game_session.current_stage.number}')
                return Response(
                    {'error': 'El stage_number no coincide con la etapa actual'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        # Si se envía stage_id, verificar que coincida con el ID de etapa actual
        elif stage_id and game_session.current_stage.id != stage_id:
            print(f'❌ [Backend complete_stage] Error: stage_id no coincide')
            print(f'   - stage_id recibido: {stage_id}')
            print(f'   - current_stage.id: {game_session.current_stage.id}')
            return Response(
                {'error': 'El stage_id no coincide con la etapa actual'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from .models import SessionStage, Team, TeamActivityProgress
        
        # Obtener o crear session_stage
        session_stage = SessionStage.objects.filter(
            game_session=game_session,
            stage=game_session.current_stage
        ).first()
        
        print(f'📊 [Backend complete_stage] SessionStage encontrado:', {
            'session_stage_id': session_stage.id if session_stage else None,
            'status_actual': session_stage.status if session_stage else None,
            'completed_at_actual': session_stage.completed_at if session_stage else None
        })
        
        if not session_stage:
            print(f'📝 [Backend complete_stage] Creando nuevo SessionStage...')
            session_stage = SessionStage.objects.create(
                game_session=game_session,
                stage=game_session.current_stage,
                status='completed',
                completed_at=timezone.now()
            )
            print(f'✅ [Backend complete_stage] SessionStage creado con status=completed')
        else:
            # Marcar la etapa como completada
            print(f'📝 [Backend complete_stage] Actualizando SessionStage existente...')
            print(f'   - Status anterior: {session_stage.status}')
            session_stage.status = 'completed'
            if not session_stage.completed_at:
                session_stage.completed_at = timezone.now()
            session_stage.save()
            print(f'✅ [Backend complete_stage] SessionStage actualizado:', {
                'status': session_stage.status,
                'completed_at': session_stage.completed_at.isoformat() if session_stage.completed_at else None
            })
        
        # Si hay una actividad actual, marcarla como completada para todos los equipos
        if game_session.current_activity:
            current_activity = game_session.current_activity
            print(f'📝 [Backend complete_stage] Marcando actividad actual como completada para todos los equipos...')
            print(f'   - Actividad: {current_activity.name} (ID: {current_activity.id})')
            teams = Team.objects.filter(game_session=game_session)
            print(f'   - Total equipos: {teams.count()}')
            
            for team in teams:
                progress, created = TeamActivityProgress.objects.get_or_create(
                    team=team,
                    activity=current_activity,
                    session_stage=session_stage,
                    defaults={
                        'status': 'completed',
                        'progress_percentage': 100,
                        'completed_at': timezone.now()
                    }
                )
                if not created:
                    # Si ya existía, actualizar a completado
                    progress.status = 'completed'
                    progress.progress_percentage = 100
                    if not progress.completed_at:
                        progress.completed_at = timezone.now()
                    progress.save()
                print(f'   - Equipo {team.id} ({team.name}): {"Creado" if created else "Actualizado"}')
        
        # Limpiar current_activity para indicar que estamos en resultados
        print(f'📝 [Backend complete_stage] Limpiando current_activity...')
        print(f'   - current_activity ANTES: {game_session.current_activity.id if game_session.current_activity else None}')
        game_session.current_activity = None
        game_session.save()
        print(f'   - current_activity DESPUÉS: {game_session.current_activity}')
        print(f'✅ [Backend complete_stage] current_activity limpiado correctamente')
        
        # Refrescar para obtener datos actualizados
        game_session.refresh_from_db()
        
        serializer = self.get_serializer(game_session)
        response_data = {
            **serializer.data,
            'stage_completed': True,
            'stage_id': game_session.current_stage.id,
            'stage_name': game_session.current_stage.name,
            'stage_number': game_session.current_stage.number,
            'message': f'Etapa {game_session.current_stage.number} completada. Mostrando resultados...'
        }
        
        print(f'✅ [Backend complete_stage] COMPLETADO - Respuesta:', {
            'stage_completed': response_data['stage_completed'],
            'stage_id': response_data['stage_id'],
            'stage_number': response_data['stage_number'],
            'current_activity': response_data.get('current_activity'),
            'current_activity_name': response_data.get('current_activity_name')
        })
        print(f'   - Las tablets deberían detectar current_activity=None en el próximo polling')
        
        return Response(response_data)

    @action(detail=True, methods=['get'], permission_classes=[], authentication_classes=[])
    def activity_timer(self, request, pk=None):
        """
        Obtener información del temporizador de la actividad actual
        Endpoint centralizado para sincronización de temporizadores
        Permite acceso sin autenticación para tablets
        """
        try:
            # Obtener sesión directamente sin verificar permisos
            try:
                game_session = GameSession.objects.get(id=pk)
            except GameSession.DoesNotExist:
                return Response(
                    {'error': 'Sesión no encontrada'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if not game_session.current_activity:
                return Response(
                    {'error': 'No hay actividad actual'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            activity = game_session.current_activity
            
            # Manejar timer_duration de forma segura (puede ser None)
            timer_duration = getattr(activity, 'timer_duration', None)
            
            # Obtener el started_at más temprano de todos los equipos para esta actividad
            from .models import SessionStage, TeamActivityProgress
            session_stage = None
            if game_session.current_stage:
                session_stage = SessionStage.objects.filter(
                    game_session=game_session,
                    stage=game_session.current_stage
                ).first()
            
            earliest_start = None
            if session_stage:
                try:
                    progress_list = TeamActivityProgress.objects.filter(
                        activity=activity,
                        session_stage=session_stage
                    ).exclude(started_at__isnull=True).order_by('started_at')
                    
                    if progress_list.exists():
                        earliest_start = progress_list.first().started_at
                except Exception as e:
                    print(f"Error obteniendo progress_list: {e}")
            
            # Si no hay started_at, usar el started_at de la sesión
            if not earliest_start and game_session.started_at:
                earliest_start = game_session.started_at
            
            return Response({
                'activity_id': activity.id,
                'activity_name': activity.name,
                'timer_duration': timer_duration,  # En segundos (puede ser None)
                'started_at': earliest_start.isoformat() if earliest_start else None,
                'current_time': timezone.now().isoformat(),
                'remaining_seconds': None  # Se calculará en el cliente
            })
        except Exception as e:
            import traceback
            print(f"Error en activity_timer: {e}")
            print(traceback.format_exc())
            return Response(
                {'error': f'Error interno del servidor: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'], permission_classes=[], authentication_classes=[])
    def stage_results(self, request, pk=None):
        """
        Obtener resultados de una etapa completada
        Permite acceso sin autenticación para tablets
        """
        # Obtener sesión directamente sin verificar permisos
        try:
            game_session = GameSession.objects.get(id=pk)
        except GameSession.DoesNotExist:
            return Response(
                {'error': 'Sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        stage_id = request.query_params.get('stage_id')
        
        if not stage_id:
            # Si no se especifica stage_id, usar la etapa actual
            if not game_session.current_stage:
                return Response(
                    {'error': 'No hay etapa actual establecida'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            stage_id = game_session.current_stage.id
        
        from challenges.models import Stage
        from .models import SessionStage, Team, TokenTransaction
        
        try:
            stage = Stage.objects.get(id=stage_id)
        except Stage.DoesNotExist:
            return Response(
                {'error': 'Etapa no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener SessionStage para esta etapa
        session_stage = SessionStage.objects.filter(
            game_session=game_session,
            stage=stage
        ).first()
        
        if not session_stage:
            return Response(
                {'error': 'No se encontró información de esta etapa para esta sesión'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener todos los equipos
        teams = Team.objects.filter(game_session=game_session)
        
        # Calcular resultados para cada equipo
        results = []
        for team in teams:
            # Tokens ganados en esta etapa
            from django.db.models import Sum
            stage_tokens = TokenTransaction.objects.filter(
                team=team,
                game_session=game_session,
                session_stage=session_stage
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # Tokens totales acumulados
            total_tokens = team.tokens_total
            
            # Progreso de actividades en esta etapa
            from .models import TeamActivityProgress
            from challenges.models import Activity
            activities = Activity.objects.filter(stage=stage, is_active=True).order_by('order_number')
            
            activities_progress = []
            for activity in activities:
                progress = TeamActivityProgress.objects.filter(
                    team=team,
                    activity=activity,
                    session_stage=session_stage
                ).first()
                
                # Si no hay progreso pero la etapa está completada, considerar todas las actividades como completadas
                # Si hay progreso, usar su estado real
                if progress:
                    activity_status = progress.status
                    progress_percentage = progress.progress_percentage
                    completed_at = progress.completed_at.isoformat() if progress.completed_at else None
                else:
                    # Si no hay registro de progreso pero estamos en resultados de etapa completada,
                    # considerar como completada (puede que no se haya registrado correctamente)
                    if session_stage.status == 'completed':
                        activity_status = 'completed'
                        progress_percentage = 100
                        completed_at = None
                    else:
                        activity_status = 'pending'
                        progress_percentage = 0
                        completed_at = None
                
                activities_progress.append({
                    'activity_id': activity.id,
                    'activity_name': activity.name,
                    'status': activity_status,
                    'progress_percentage': progress_percentage,
                    'completed_at': completed_at
                })
            
            results.append({
                'team_id': team.id,
                'team_name': team.name,
                'team_color': team.color,
                'tokens_stage': stage_tokens,
                'tokens_total': total_tokens,
                'activities_progress': activities_progress
            })
        
        # Ordenar por tokens totales (ranking)
        results.sort(key=lambda x: x['tokens_total'], reverse=True)
        
        return Response({
            'stage_id': stage.id,
            'stage_name': stage.name,
            'stage_number': stage.number,
            'session_stage_id': session_stage.id,
            'session_stage_status': session_stage.status,
            'session_stage_completed_at': session_stage.completed_at.isoformat() if session_stage.completed_at else None,
            'teams_results': results
        })

    @action(detail=True, methods=['post'])
    def next_stage(self, request, pk=None):
        """
        Avanzar a la siguiente etapa
        """
        game_session = self.get_object()
        
        if game_session.status != 'running':
            return Response(
                {'error': 'La sesión debe estar en estado running'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not game_session.current_stage:
            return Response(
                {'error': 'No hay etapa actual establecida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from challenges.models import Stage
        current_stage_number = game_session.current_stage.number
        next_stage = Stage.objects.filter(
            number=current_stage_number + 1,
            is_active=True
        ).first()
        
        if not next_stage:
            return Response(
                {'error': 'No hay más etapas disponibles'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar etapa actual
        game_session.current_stage = next_stage
        
        # Obtener la primera actividad de la nueva etapa
        from challenges.models import Activity
        first_activity = Activity.objects.filter(
            stage=next_stage,
            is_active=True
        ).order_by('order_number').first()
        
        if first_activity:
            game_session.current_activity = first_activity
        else:
            game_session.current_activity = None
        
        game_session.save()
        
        # Crear SessionStage para la nueva etapa
        from .models import SessionStage, Team, TeamActivityProgress
        session_stage, created = SessionStage.objects.get_or_create(
            game_session=game_session,
            stage=next_stage,
            defaults={
                'status': 'in_progress',
                'started_at': timezone.now()
            }
        )
        
        # Si la etapa ya existía pero estaba completada, actualizar su estado
        if not created and session_stage.status == 'completed':
            session_stage.status = 'in_progress'
            session_stage.completed_at = None
            session_stage.save()
        
        # Si hay una primera actividad, inicializar started_at para todos los equipos
        if first_activity:
            teams = Team.objects.filter(game_session=game_session)
            for team in teams:
                progress, created = TeamActivityProgress.objects.get_or_create(
                    team=team,
                    activity=first_activity,
                    session_stage=session_stage,
                    defaults={
                        'status': 'in_progress',
                        'started_at': timezone.now(),
                        'progress_percentage': 0
                    }
                )
                # Si ya existía, actualizar started_at si no tenía
                if not created and not progress.started_at:
                    progress.started_at = timezone.now()
                    progress.status = 'in_progress'
                    progress.save()
        
        game_session.refresh_from_db()
        game_session = GameSession.objects.select_related(
            'current_stage', 'current_activity'
        ).get(id=game_session.id)
        
        serializer = self.get_serializer(game_session)
        return Response({
            **serializer.data,
            'message': f'Avanzando a Etapa {next_stage.number}: {next_stage.name}',
            'next_stage_number': next_stage.number
        })

    @action(detail=True, methods=['post'])
    def end(self, request, pk=None):
        """Finalizar una sesión de juego"""
        game_session = self.get_object()
        if game_session.status not in ['lobby', 'running']:
            return Response(
                {'error': 'La sesión no está activa'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Desconectar todas las tablets activas
        from .models import TabletConnection
        active_connections = TabletConnection.objects.filter(
            game_session=game_session,
            disconnected_at__isnull=True
        )
        
        disconnect_time = timezone.now()
        for connection in active_connections:
            connection.disconnected_at = disconnect_time
            connection.save()
        
        # Finalizar sesión
        game_session.status = 'completed'
        game_session.ended_at = disconnect_time
        game_session.save()
        
        serializer = self.get_serializer(game_session)
        return Response({
            **serializer.data,
            'tablets_disconnected': active_connections.count()
        })

    @action(detail=False, methods=['get'])
    def active_session(self, request):
        """
        Obtener la sesión activa del profesor (lobby o running)
        Solo puede haber UNA sesión activa por profesor.
        Prioriza sesiones en estado 'running' sobre 'lobby'
        """
        try:
            professor = request.user.professor
        except Professor.DoesNotExist:
            return Response(
                {'error': 'El usuario no es un profesor'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Primero buscar sesión en estado 'running' (prioridad)
        running_session = GameSession.objects.filter(
            professor=professor,
            status='running'
        ).first()
        
        if running_session:
            serializer = self.get_serializer(running_session)
            return Response(serializer.data)
        
        # Si no hay 'running', buscar 'lobby'
        lobby_session = GameSession.objects.filter(
            professor=professor,
            status='lobby'
        ).first()
        
        if lobby_session:
            serializer = self.get_serializer(lobby_session)
            return Response(serializer.data)
        
        # No hay sesión activa
        return Response(
            {'active_session': None},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def start_reflection(self, request, pk=None):
        """
        Marcar que estamos en fase de reflexión
        Esto permite que las tablets detecten que deben ir a reflexión
        Usamos presentation_timestamps como señal temporal
        """
        game_session = self.get_object()
        
        from .models import SessionStage
        from challenges.models import Stage
        
        # Obtener la etapa 4
        stage_4 = Stage.objects.filter(number=4, is_active=True).first()
        if not stage_4:
            return Response(
                {'error': 'No se encontró la Etapa 4'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener SessionStage para etapa 4
        session_stage = SessionStage.objects.filter(
            game_session=game_session,
            stage=stage_4
        ).first()
        
        if not session_stage:
            return Response(
                {'error': 'No se encontró la etapa 4 para esta sesión'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Usar presentation_timestamps como señal temporal para indicar reflexión
        if not session_stage.presentation_timestamps:
            session_stage.presentation_timestamps = {}
        
        # Agregar un flag especial para indicar reflexión
        session_stage.presentation_timestamps['_reflection'] = True
        session_stage.presentation_timestamps['_reflection_started_at'] = timezone.now().isoformat()
        session_stage.save()
        
        return Response({
            'message': 'Fase de reflexión iniciada',
            'reflection_started': True
        })
    
    @action(detail=True, methods=['get'])
    def teams(self, request, pk=None):
        """Obtener equipos de una sesión"""
        game_session = self.get_object()
        teams = game_session.teams.all()
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[], authentication_classes=[])
    def lobby(self, request, pk=None):
        """
        Obtener información completa del lobby de una sesión
        Incluye: equipos, estudiantes, tablets conectadas, código QR
        No requiere autenticación (accesible para tablets)
        Solo funciona si la sesión está en estado 'lobby' o 'running'
        """
        # Obtener sesión directamente sin verificar permisos
        try:
            game_session = GameSession.objects.get(id=pk)
        except GameSession.DoesNotExist:
            return Response(
                {'error': 'Sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar que la sesión esté activa (lobby o running)
        if game_session.status not in ['lobby', 'running']:
            return Response(
                {
                    'error': 'La sesión ya ha finalizado',
                    'status': game_session.status,
                    'ended_at': game_session.ended_at
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener equipos con estudiantes
        teams = game_session.teams.prefetch_related('students', 'tablet_connections__tablet').all()
        team_serializer = TeamSerializer(teams, many=True)
        
        # Obtener conexiones de tablets activas
        tablet_connections = game_session.tablet_connections.filter(disconnected_at__isnull=True)
        tablet_serializer = TabletConnectionSerializer(tablet_connections, many=True)
        
        # Verificar si todas las tablets están conectadas
        all_teams_have_tablets = all(
            team.tablet_connections.filter(disconnected_at__isnull=True).exists()
            for team in teams
        )
        
        # Serializar sesión
        session_serializer = GameSessionSerializer(game_session)
        
        return Response({
            'game_session': session_serializer.data,
            'teams': team_serializer.data,
            'tablet_connections': tablet_serializer.data,
            'all_teams_connected': all_teams_have_tablets,
            'total_teams': teams.count(),
            'connected_teams': sum(1 for team in teams if team.tablet_connections.filter(disconnected_at__isnull=True).exists())
        })


class TeamViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Equipos
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['game_session', 'color']
    search_fields = ['name', 'game_session__room_code']

    def get_queryset(self):
        queryset = Team.objects.select_related('game_session').prefetch_related('students')
        game_session_id = self.request.query_params.get('game_session')
        if game_session_id:
            queryset = queryset.filter(game_session_id=game_session_id)
        return queryset

    @action(detail=True, methods=['post'])
    def move_student(self, request, pk=None):
        """
        Mover un estudiante de un equipo a otro
        
        Requiere:
        - student_id: ID del estudiante a mover
        - target_team_id: ID del equipo destino
        """
        team = self.get_object()
        student_id = request.data.get('student_id')
        target_team_id = request.data.get('target_team_id')
        
        if not student_id or not target_team_id:
            return Response(
                {'error': 'Se requiere student_id y target_team_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            student = Student.objects.get(id=student_id)
            target_team = Team.objects.get(id=target_team_id)
        except (Student.DoesNotExist, Team.DoesNotExist):
            return Response(
                {'error': 'Estudiante o equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar que el estudiante esté en el equipo actual
        if not team.students.filter(id=student_id).exists():
            return Response(
                {'error': 'El estudiante no está en este equipo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que el equipo destino esté en la misma sesión
        if team.game_session != target_team.game_session:
            return Response(
                {'error': 'Los equipos deben estar en la misma sesión'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mover estudiante
        TeamStudent.objects.filter(team=team, student=student).delete()
        TeamStudent.objects.get_or_create(team=target_team, student=student)
        
        # Serializar equipos actualizados
        team_serializer = TeamSerializer(team)
        target_team_serializer = TeamSerializer(target_team)
        
        return Response({
            'message': 'Estudiante movido exitosamente',
            'source_team': team_serializer.data,
            'target_team': target_team_serializer.data
        })

    @action(detail=False, methods=['post'])
    def shuffle_all(self, request):
        """
        Reorganizar todos los estudiantes de una sesión aleatoriamente
        Mantiene el número de equipos y el tamaño mínimo/máximo
        """
        game_session_id = request.data.get('game_session_id')
        if not game_session_id:
            return Response(
                {'error': 'Se requiere game_session_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            game_session = GameSession.objects.get(id=game_session_id)
        except GameSession.DoesNotExist:
            return Response(
                {'error': 'Sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener todos los estudiantes de la sesión
        all_students = list(
            Student.objects.filter(teams__game_session=game_session).distinct()
        )
        
        if not all_students:
            return Response(
                {'error': 'No hay estudiantes en esta sesión'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener equipos existentes
        teams = list(game_session.teams.all())
        
        if not teams:
            return Response(
                {'error': 'No hay equipos en esta sesión'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Eliminar todas las asignaciones actuales
        TeamStudent.objects.filter(team__game_session=game_session).delete()
        
        # Mezclar estudiantes aleatoriamente
        random.shuffle(all_students)
        
        # Redistribuir estudiantes
        min_size = 3
        max_size = 8
        num_teams = len(teams)
        total_students = len(all_students)
        
        base_team_size = total_students // num_teams
        remainder = total_students % num_teams
        
        student_index = 0
        for i, team in enumerate(teams):
            current_team_size = base_team_size + (1 if i < remainder else 0)
            current_team_size = max(min_size, min(max_size, current_team_size))
            
            team_students = all_students[student_index:student_index + current_team_size]
            student_index += current_team_size
            
            # Asignar estudiantes al equipo
            for student in team_students:
                TeamStudent.objects.create(team=team, student=student)
        
        # Serializar equipos actualizados
        teams_serializer = TeamSerializer(teams, many=True)
        
        return Response({
            'message': 'Estudiantes reorganizados aleatoriamente',
            'teams': teams_serializer.data
        })


class TeamPersonalizationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Personalización de Equipos
    """
    queryset = TeamPersonalization.objects.all()
    serializer_class = TeamPersonalizationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['team']

    def get_permissions(self):
        """
        Permite crear/actualizar/listar sin autenticación para tablets
        """
        if self.action in ['create', 'update', 'partial_update', 'list']:
            return []
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        """
        Crear o actualizar personalización (permite sin autenticación para tablets)
        """
        team_id = request.data.get('team')
        
        if not team_id:
            return Response(
                {'error': 'Se requiere team'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Crear o actualizar personalización
        personalization, created = TeamPersonalization.objects.update_or_create(
            team=team,
            defaults={
                'team_name': request.data.get('team_name', ''),
                'team_members_know_each_other': request.data.get('team_members_know_each_other')
            }
        )
        
        serializer = self.get_serializer(personalization)
        
        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.data, status=status.HTTP_200_OK)


class SessionStageViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Etapas de Sesión
    """
    queryset = SessionStage.objects.all()
    serializer_class = SessionStageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['game_session', 'stage', 'status']
    search_fields = ['game_session__room_code', 'stage__name']
    ordering_fields = ['started_at', 'completed_at']
    ordering = ['stage__number']

    def get_permissions(self):
        """
        Permite leer sin autenticación para tablets
        Permite marcar presentación como completada sin autenticación
        """
        if self.action in ['list', 'retrieve', 'presentation_status', 'mark_presentation_done']:
            return []
        return super().get_permissions()

    def get_queryset(self):
        return SessionStage.objects.select_related('game_session', 'stage')
    
    @action(detail=True, methods=['post'])
    def generate_presentation_order(self, request, pk=None):
        """
        Generar orden de presentación automáticamente (aleatorio) para la Etapa 4
        """
        session_stage = self.get_object()
        
        if session_stage.stage.number != 4:
            return Response(
                {'error': 'Este endpoint solo está disponible para la Etapa 4'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from .models import Team
        import random
        
        teams = Team.objects.filter(game_session=session_stage.game_session)
        team_ids = list(teams.values_list('id', flat=True))
        
        # Generar orden aleatorio
        random.shuffle(team_ids)
        
        session_stage.presentation_order = team_ids
        session_stage.save()
        
        serializer = self.get_serializer(session_stage)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_presentation_order(self, request, pk=None):
        """
        Actualizar el orden de presentación (el profesor puede reordenar)
        """
        session_stage = self.get_object()
        
        if session_stage.stage.number != 4:
            return Response(
                {'error': 'Este endpoint solo está disponible para la Etapa 4'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        new_order = request.data.get('presentation_order')
        if not new_order or not isinstance(new_order, list):
            return Response(
                {'error': 'Se requiere presentation_order como array de IDs de equipos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session_stage.presentation_order = new_order
        session_stage.save()
        
        serializer = self.get_serializer(session_stage)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def start_presentation(self, request, pk=None):
        """
        Iniciar las presentaciones (confirmar orden y comenzar con el primer equipo)
        """
        session_stage = self.get_object()
        
        if session_stage.stage.number != 4:
            return Response(
                {'error': 'Este endpoint solo está disponible para la Etapa 4'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not session_stage.presentation_order:
            return Response(
                {'error': 'Primero debes generar o confirmar el orden de presentación'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Establecer el primer equipo como el que está presentando y cambiar estado a 'preparing'
        if len(session_stage.presentation_order) > 0:
            session_stage.current_presentation_team_id = session_stage.presentation_order[0]
            # Solo establecer presentation_state si el campo existe (migración aplicada)
            if hasattr(session_stage, 'presentation_state'):
                session_stage.presentation_state = 'preparing'  # Estado de preparación
            session_stage.save()
        
        serializer = self.get_serializer(session_stage)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def next_presentation(self, request, pk=None):
        """
        Avanzar al siguiente equipo en el orden de presentación
        """
        session_stage = self.get_object()
        
        if session_stage.stage.number != 4:
            return Response(
                {'error': 'Este endpoint solo está disponible para la Etapa 4'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not session_stage.presentation_order:
            return Response(
                {'error': 'No hay orden de presentación establecido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        current_index = None
        if session_stage.current_presentation_team_id:
            try:
                current_index = session_stage.presentation_order.index(session_stage.current_presentation_team_id)
            except ValueError:
                current_index = 0
        
        # Avanzar al siguiente
        if current_index is None or current_index < 0:
            next_index = 0
        else:
            next_index = current_index + 1
        
        if next_index >= len(session_stage.presentation_order):
            # Todas las presentaciones completadas
            session_stage.current_presentation_team_id = None
            if hasattr(session_stage, 'presentation_state'):
                session_stage.presentation_state = 'not_started'  # Ya no hay más presentaciones
        else:
            session_stage.current_presentation_team_id = session_stage.presentation_order[next_index]
            if hasattr(session_stage, 'presentation_state'):
                session_stage.presentation_state = 'preparing'  # Preparar al siguiente equipo
        
        session_stage.save()
        
        serializer = self.get_serializer(session_stage)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def start_team_pitch(self, request, pk=None):
        """
        Iniciar el pitch del equipo actual (cambiar estado a 'presenting' e iniciar temporizador de 3 minutos)
        """
        from django.utils import timezone
        
        session_stage = self.get_object()
        
        if session_stage.stage.number != 4:
            return Response(
                {'error': 'Este endpoint solo está disponible para la Etapa 4'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not session_stage.current_presentation_team_id:
            return Response(
                {'error': 'No hay un equipo presentando actualmente'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar estado si el campo existe (migración aplicada)
        if hasattr(session_stage, 'presentation_state') and session_stage.presentation_state != 'preparing':
            return Response(
                {'error': 'El equipo no está en estado de preparación'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cambiar estado a 'presenting' e iniciar temporizador
        if hasattr(session_stage, 'presentation_state'):
            session_stage.presentation_state = 'presenting'
        
        # Guardar timestamp de inicio de presentación en un campo JSONField
        # Usaremos presentation_order como almacenamiento temporal, o mejor crear un nuevo campo
        # Por ahora, guardaremos en un diccionario usando el campo JSONField existente
        # Necesitamos un campo específico, pero usaremos presentation_order temporalmente
        # O mejor, guardar en un campo separado si existe
        
        # Guardar el timestamp de inicio de la presentación actual
        presentation_started_at = timezone.now()
        
        # Guardar el timestamp en presentation_timestamps (JSONField)
        if not hasattr(session_stage, 'presentation_timestamps') or session_stage.presentation_timestamps is None:
            session_stage.presentation_timestamps = {}
        
        team_id = session_stage.current_presentation_team_id
        session_stage.presentation_timestamps[str(team_id)] = presentation_started_at.isoformat()
        
        session_stage.save()
        
        serializer = self.get_serializer(session_stage)
        response_data = serializer.data
        # Agregar el timestamp de inicio en la respuesta
        response_data['presentation_started_at'] = presentation_started_at.isoformat()
        response_data['presentation_duration'] = 180  # 3 minutos en segundos
        
        return Response(response_data)
    
    @action(detail=True, methods=['post'])
    def finish_team_presentation(self, request, pk=None):
        """
        Finalizar la presentación del equipo actual (cambiar estado a 'evaluating')
        """
        session_stage = self.get_object()
        
        if session_stage.stage.number != 4:
            return Response(
                {'error': 'Este endpoint solo está disponible para la Etapa 4'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not session_stage.current_presentation_team_id:
            return Response(
                {'error': 'No hay un equipo presentando actualmente'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar estado si el campo existe (migración aplicada)
        if hasattr(session_stage, 'presentation_state') and session_stage.presentation_state != 'presenting':
            return Response(
                {'error': 'El equipo no está en estado de presentación'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cambiar estado a 'evaluating'
        if hasattr(session_stage, 'presentation_state'):
            session_stage.presentation_state = 'evaluating'
        session_stage.save()
        
        serializer = self.get_serializer(session_stage)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[])
    def presentation_status(self, request, pk=None):
        """
        Obtener el estado actual de las presentaciones (para tablets)
        """
        session_stage = self.get_object()
        
        if session_stage.stage.number != 4:
            return Response(
                {'error': 'Este endpoint solo está disponible para la Etapa 4'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from .models import Team
        from challenges.models import Activity
        
        teams_data = []
        completed_team_ids = []
        
        # Obtener la actividad de presentación del pitch
        try:
            presentation_activity = Activity.objects.filter(
                stage__number=4,
                activity_type__name__icontains='presentación'
            ).first()
            
            if presentation_activity and session_stage.presentation_order:
                # Verificar qué equipos ya completaron su presentación
                completed_progress = TeamActivityProgress.objects.filter(
                    session_stage=session_stage,
                    activity=presentation_activity,
                    status='completed'
                ).values_list('team_id', flat=True)
                completed_team_ids = list(completed_progress)
        except Exception as e:
            print(f"Error al obtener equipos completados: {e}")
        
        if session_stage.presentation_order:
            for team_id in session_stage.presentation_order:
                try:
                    team = Team.objects.get(id=team_id)
                    teams_data.append({
                        'id': team.id,
                        'name': team.name,
                        'color': team.color
                    })
                except Team.DoesNotExist:
                    continue
        
        # Obtener prototipo y pitch del equipo que está presentando
        current_team_prototype = None
        current_team_pitch = None
        
        if session_stage.current_presentation_team_id:
            try:
                from .models import TeamActivityProgress
                current_team = Team.objects.get(id=session_stage.current_presentation_team_id)
                
                # Obtener actividad de prototipo (Etapa 3)
                prototype_activity = Activity.objects.filter(
                    stage__number=3,
                    activity_type__name__icontains='prototipo'
                ).first()
                
                # Obtener actividad de formulario pitch (Etapa 4)
                pitch_activity = Activity.objects.filter(
                    stage__number=4,
                    activity_type__name__icontains='formulario'
                ).first()
                
                # Obtener prototipo
                if prototype_activity:
                    prototype_progress = TeamActivityProgress.objects.filter(
                        team=current_team,
                        activity=prototype_activity,
                        session_stage__game_session=session_stage.game_session,
                        session_stage__stage__number=3
                    ).first()
                    
                    if prototype_progress and prototype_progress.prototype_image_url:
                        current_team_prototype = prototype_progress.prototype_image_url
                
                # Obtener pitch
                if pitch_activity:
                    pitch_progress = TeamActivityProgress.objects.filter(
                        team=current_team,
                        activity=pitch_activity,
                        session_stage=session_stage
                    ).first()
                    
                    if pitch_progress:
                        current_team_pitch = {
                            'intro_problem': pitch_progress.pitch_intro_problem or '',
                            'solution': pitch_progress.pitch_solution or '',
                            'closing': pitch_progress.pitch_closing or ''
                        }
            except Exception as e:
                print(f"Error obteniendo prototipo/pitch del equipo actual: {e}")
        
        response_data = {
            'presentation_order': session_stage.presentation_order,
            'current_presentation_team_id': session_stage.current_presentation_team_id,
            'teams': teams_data,
            'order_confirmed': session_stage.current_presentation_team_id is not None,  # True si las presentaciones comenzaron
            'completed_team_ids': completed_team_ids,  # Equipos que ya completaron su presentación
            'presentation_state': getattr(session_stage, 'presentation_state', 'not_started'),  # Estado actual: 'not_started', 'preparing', 'presenting', 'evaluating'
            'current_team_prototype': current_team_prototype,  # URL de la imagen del prototipo del equipo que presenta
            'current_team_pitch': current_team_pitch  # Guion del pitch del equipo que presenta
        }
        
        return Response(response_data)
    
    @action(detail=True, methods=['get'], permission_classes=[])
    def presentation_timer(self, request, pk=None):
        """
        Obtener información del temporizador de la presentación actual (3 minutos)
        Endpoint para tablets y profesor para sincronizar el temporizador
        """
        from datetime import datetime
        
        session_stage = self.get_object()
        
        if session_stage.stage.number != 4:
            return Response(
                {'error': 'Este endpoint solo está disponible para la Etapa 4'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not session_stage.current_presentation_team_id:
            return Response(
                {'error': 'No hay un equipo presentando actualmente'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener el timestamp de inicio de la presentación del equipo actual
        team_id = str(session_stage.current_presentation_team_id)
        presentation_timestamps = getattr(session_stage, 'presentation_timestamps', None) or {}
        
        if team_id not in presentation_timestamps:
            return Response(
                {'error': 'La presentación aún no ha iniciado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parsear el timestamp
        try:
            started_at_str = presentation_timestamps[team_id]
            if isinstance(started_at_str, str):
                # Parsear ISO format string
                if 'T' in started_at_str:
                    started_at = datetime.fromisoformat(started_at_str.replace('Z', '+00:00'))
                else:
                    started_at = datetime.fromisoformat(started_at_str)
                # Convertir a timezone aware si no lo es
                if timezone.is_naive(started_at):
                    started_at = timezone.make_aware(started_at)
            else:
                started_at = started_at_str
        except Exception as e:
            return Response(
                {'error': f'Error al parsear timestamp: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Calcular tiempo restante (3 minutos = 180 segundos)
        duration_seconds = 180
        elapsed = (timezone.now() - started_at).total_seconds()
        remaining = max(0, duration_seconds - elapsed)
        
        return Response({
            'started_at': started_at.isoformat(),
            'timer_duration': duration_seconds,
            'remaining_seconds': int(remaining),
            'is_finished': remaining <= 0,
            'current_time': timezone.now().isoformat()
        })
    
    @action(detail=True, methods=['post'], permission_classes=[])
    def mark_presentation_done(self, request, pk=None):
        """
        Marcar que un equipo completó su presentación (desde tablets)
        """
        team_id = request.data.get('team_id')
        activity_id = request.data.get('activity_id')
        
        if not team_id or not activity_id:
            return Response(
                {'error': 'Se requieren team_id y activity_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session_stage = self.get_object()
        
        if session_stage.stage.number != 4:
            return Response(
                {'error': 'Este endpoint solo está disponible para la Etapa 4'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from .models import Team
            from challenges.models import Activity
            
            team = Team.objects.get(id=team_id)
            activity = Activity.objects.get(id=activity_id)
            
            # Verificar que el equipo que está presentando es el correcto
            if session_stage.current_presentation_team_id != team_id:
                return Response(
                    {'error': 'No es tu turno de presentar'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Marcar la actividad de presentación como completada para este equipo
            progress, created = TeamActivityProgress.objects.get_or_create(
                team=team,
                activity=activity,
                session_stage=session_stage,
                defaults={
                    'status': 'completed',
                    'progress_percentage': 100,
                    'completed_at': timezone.now(),
                    'started_at': timezone.now()
                }
            )
            
            if not created:
                progress.status = 'completed'
                progress.progress_percentage = 100
                if not progress.completed_at:
                    progress.completed_at = timezone.now()
                if not progress.started_at:
                    progress.started_at = timezone.now()
                progress.save()
            
            serializer = TeamActivityProgressSerializer(progress)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Team.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Activity.DoesNotExist:
            return Response(
                {'error': 'Actividad no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeamActivityProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Progreso de Actividades de Equipos
    """
    queryset = TeamActivityProgress.objects.all()
    serializer_class = TeamActivityProgressSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['team', 'session_stage', 'activity', 'status']
    search_fields = ['team__name', 'activity__name']
    ordering_fields = ['started_at', 'completed_at', 'progress_percentage']
    ordering = ['-started_at']

    def get_permissions(self):
        """
        Permite crear/actualizar sin autenticación para tablets
        """
        if self.action in ['create', 'update', 'partial_update', 'list', 'submit_anagram', 'select_topic', 'select_challenge', 'upload_prototype', 'save_pitch']:
            return []
        return super().get_permissions()
    
    def get_parsers(self):
        """
        Soporta FormData para subida de imágenes
        """
        # Verificar si action existe y es 'upload_prototype'
        if hasattr(self, 'action') and self.action == 'upload_prototype':
            return [MultiPartParser, FormParser]
        return super().get_parsers()

    def get_queryset(self):
        return TeamActivityProgress.objects.select_related(
            'team', 'session_stage__stage', 'activity', 'selected_topic', 'selected_challenge'
        )

    def create(self, request, *args, **kwargs):
        """
        Crear o actualizar progreso de actividad (permite sin autenticación para tablets)
        """
        team_id = request.data.get('team')
        activity_id = request.data.get('activity')
        session_stage_id = request.data.get('session_stage')
        status_value = request.data.get('status', 'pending')
        
        if not all([team_id, activity_id, session_stage_id]):
            return Response(
                {'error': 'Se requieren team, activity y session_stage'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from .models import Team, SessionStage
            from challenges.models import Activity
            
            team = Team.objects.get(id=team_id)
            activity = Activity.objects.get(id=activity_id)
            session_stage = SessionStage.objects.get(id=session_stage_id)
            
            # Obtener o crear progreso (manejar casos de duplicados)
            progress_list = TeamActivityProgress.objects.filter(
                team=team,
                activity=activity,
                session_stage=session_stage
            )
            
            if progress_list.exists():
                # Si hay registros existentes, usar el primero (o eliminar duplicados si hay más de uno)
                progress = progress_list.first()
                
                # Si hay más de un registro, eliminar los duplicados y mantener el mejor (completado > en progreso > pendiente)
                if progress_list.count() > 1:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.warning(f'Se encontraron {progress_list.count()} registros duplicados para TeamActivityProgress (team={team.id}, activity={activity.id}, session_stage={session_stage.id}). Eliminando duplicados...')
                    
                    # Priorizar el registro con mejor estado: completed > in_progress > submitted > pending
                    status_priority = {'completed': 4, 'in_progress': 3, 'submitted': 2, 'pending': 1}
                    best_progress = max(progress_list, key=lambda p: status_priority.get(p.status, 0))
                    
                    # Mantener el mejor registro
                    progress = best_progress
                    
                    # Eliminar los demás
                    ids_to_delete = list(progress_list.exclude(id=progress.id).values_list('id', flat=True))
                    TeamActivityProgress.objects.filter(id__in=ids_to_delete).delete()
                    logger.info(f'Eliminados {len(ids_to_delete)} registros duplicados. Mantenido registro ID {progress.id} con status {progress.status}')
                
                created = False
            else:
                # No existe, crear uno nuevo
                progress = TeamActivityProgress.objects.create(
                    team=team,
                    activity=activity,
                    session_stage=session_stage,
                    status=status_value,
                    started_at=timezone.now() if not request.data.get('started_at') else None
                )
                created = True
            
            # Actualizar el status y otros campos
            progress.status = status_value
            
            # Si el status es 'completed', establecer completed_at y otorgar tokens
            if status_value == 'completed':
                was_completed = progress.completed_at is not None
                if not progress.completed_at:
                    progress.completed_at = timezone.now()
                if progress.progress_percentage < 100:
                    progress.progress_percentage = 100
                
                # Otorgar tokens solo si no estaba completado antes (para evitar duplicados)
                if not was_completed:
                    from .models import TokenTransaction
                    tokens_to_award = 15  # Tokens por completar la presentación
                    
                    # Verificar si ya se otorgaron tokens para esta actividad (evitar duplicados)
                    existing_transaction = TokenTransaction.objects.filter(
                        team=team,
                        game_session=session_stage.game_session,
                        session_stage=session_stage,
                        source_type='activity',
                        source_id=activity.id
                    ).exists()
                    
                    if not existing_transaction:
                        # Crear transacción de tokens
                        TokenTransaction.objects.create(
                            team=team,
                            game_session=session_stage.game_session,
                            session_stage=session_stage,
                            amount=tokens_to_award,
                            source_type='activity',
                            source_id=activity.id,
                            reason=f'Actividad "{activity.name}": Presentación completada',
                            awarded_by=None  # Sistema automático
                        )
                        
                        # Actualizar tokens del equipo
                        team.tokens_total += tokens_to_award
                        team.save()
            
            # Actualizar otros campos si se proporcionan
            if 'response_data' in request.data:
                progress.response_data = request.data.get('response_data')
            if 'progress_percentage' in request.data:
                progress.progress_percentage = request.data.get('progress_percentage')
            
            progress.save()
            
            serializer = self.get_serializer(progress)
            if created:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.data, status=status.HTTP_200_OK)
                
        except Team.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Activity.DoesNotExist:
            return Response(
                {'error': 'Actividad no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except SessionStage.DoesNotExist:
            return Response(
                {'error': 'Etapa de sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f'Error al crear/actualizar progreso: {e}')
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], permission_classes=[])
    def submit_anagram(self, request):
        """
        Endpoint para enviar respuestas del juego de anagramas
        No requiere autenticación (para tablets)
        """
        import logging
        logger = logging.getLogger(__name__)
        
        team_id = request.data.get('team')
        activity_id = request.data.get('activity')
        session_stage_id = request.data.get('session_stage')
        answers = request.data.get('answers', [])  # Lista de respuestas: [{'word': 'emprender', 'answer': 'emprender'}, ...]
        
        logger.info(f'[submit_anagram] Datos recibidos: team={team_id}, activity={activity_id}, session_stage={session_stage_id}, answers={answers}')
        
        if not team_id:
            return Response(
                {'error': 'Se requiere team', 'received': {'team': team_id, 'activity': activity_id, 'session_stage': session_stage_id, 'answers': answers}},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not activity_id:
            return Response(
                {'error': 'Se requiere activity', 'received': {'team': team_id, 'activity': activity_id, 'session_stage': session_stage_id, 'answers': answers}},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not session_stage_id:
            return Response(
                {'error': 'Se requiere session_stage', 'received': {'team': team_id, 'activity': activity_id, 'session_stage': session_stage_id, 'answers': answers}},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not answers or len(answers) == 0:
            return Response(
                {'error': 'Se requiere answers (lista no vacía)', 'received': {'team': team_id, 'activity': activity_id, 'session_stage': session_stage_id, 'answers': answers}},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from .models import Team, SessionStage, TokenTransaction
            from challenges.models import Activity
            
            team = Team.objects.get(id=team_id)
            activity = Activity.objects.get(id=activity_id)
            session_stage = SessionStage.objects.get(id=session_stage_id)
            
            # Obtener o crear el progreso
            progress, created = TeamActivityProgress.objects.get_or_create(
                team=team,
                activity=activity,
                session_stage=session_stage,
                defaults={
                    'status': 'in_progress',
                    'started_at': timezone.now()
                }
            )
            
            if not created and progress.status == 'completed':
                return Response(
                    {'error': 'Esta actividad ya fue completada'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar respuestas contra la configuración de la actividad
            config = activity.config_data or {}
            words_config = config.get('words', [])
            tokens_per_word = config.get('tokens_per_word', 5)
            
            # Obtener respuestas existentes o crear nuevas
            existing_response_data = progress.response_data or {}
            existing_answers = existing_response_data.get('answers', [])
            
            # Diccionario para fácil búsqueda de respuestas existentes
            existing_answers_dict = {a.get('word'): a for a in existing_answers}
            
            # Actualizar respuestas existentes o agregar nuevas
            new_correct_answers = 0
            new_tokens = 0
            
            for answer_data in answers:
                word = answer_data.get('word')
                answer = answer_data.get('answer', '').strip().lower()
                
                # Buscar si ya existe esta respuesta
                existing_answer = existing_answers_dict.get(word)
                
                # Buscar la palabra en la configuración
                word_config = next((w for w in words_config if w.get('word') == word), None)
                if word_config and word_config.get('word', '').lower() == answer:
                    # Verificar si es una nueva respuesta correcta (no existía o estaba incorrecta)
                    if not existing_answer or existing_answer.get('answer', '').lower() != answer:
                        new_correct_answers += 1
                        new_tokens += tokens_per_word
                    
                    # Actualizar o agregar respuesta
                    if existing_answer:
                        existing_answer['answer'] = answer
                    else:
                        existing_answers.append({'word': word, 'answer': answer})
                        existing_answers_dict[word] = existing_answers[-1]
                else:
                    # Respuesta incorrecta o nueva
                    if existing_answer:
                        existing_answer['answer'] = answer
                    else:
                        existing_answers.append({'word': word, 'answer': answer})
                        existing_answers_dict[word] = existing_answers[-1]
            
            # Contar total de respuestas correctas
            total_correct = sum(1 for a in existing_answers 
                              for w in words_config 
                              if w.get('word') == a.get('word') 
                              and w.get('word', '').lower() == a.get('answer', '').lower())
            
            # Guardar datos de respuesta
            progress.response_data = {
                'answers': existing_answers,
                'correct_answers': total_correct,
                'total_words': len(words_config),
                'tokens_earned': total_correct * tokens_per_word
            }
            
            # Actualizar progreso
            if total_correct == len(words_config):
                progress.status = 'completed'
                progress.completed_at = timezone.now()
                progress.progress_percentage = 100
                
                # Asignar tokens solo si hay nuevas respuestas correctas
                if new_tokens > 0:
                    TokenTransaction.objects.create(
                        team=team,
                        game_session=session_stage.game_session,
                        session_stage=session_stage,
                        amount=new_tokens,
                        source_type='activity',
                        source_id=activity.id,
                        reason=f'Actividad "{activity.name}": +{new_correct_answers} palabra(s) correcta(s)',
                        awarded_by=None  # Sistema automático
                    )
                    
                    # Actualizar tokens del equipo
                    team.tokens_total += new_tokens
                    team.save()
            else:
                progress.status = 'in_progress'
                progress.progress_percentage = int((total_correct / len(words_config)) * 100) if words_config else 0
                
                # Asignar tokens solo para nuevas respuestas correctas
                if new_tokens > 0:
                    TokenTransaction.objects.create(
                        team=team,
                        game_session=session_stage.game_session,
                        session_stage=session_stage,
                        amount=new_tokens,
                        source_type='activity',
                        source_id=activity.id,
                        reason=f'Actividad "{activity.name}": +{new_correct_answers} palabra(s) correcta(s)',
                        awarded_by=None
                    )
                    
                    team.tokens_total += new_tokens
                    team.save()
            
            progress.save()
            
            # Recargar el equipo para obtener tokens actualizados
            team.refresh_from_db()
            
            serializer = self.get_serializer(progress)
            return Response({
                **serializer.data,
                'correct_answers': total_correct,
                'total_words': len(words_config),
                'tokens_earned': new_tokens,  # Solo tokens ganados en este envío
                'team_tokens_total': team.tokens_total  # Tokens totales del equipo
            })
            
        except Team.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Activity.DoesNotExist:
            return Response(
                {'error': 'Actividad no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except SessionStage.DoesNotExist:
            return Response(
                {'error': 'Etapa de sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], permission_classes=[])
    def select_topic(self, request):
        """
        Seleccionar un tema para una actividad
        No requiere autenticación (para tablets)
        """
        team_id = request.data.get('team')
        activity_id = request.data.get('activity')
        session_stage_id = request.data.get('session_stage')
        topic_id = request.data.get('topic')
        
        if not all([team_id, activity_id, session_stage_id, topic_id]):
            return Response(
                {'error': 'Se requieren team, activity, session_stage y topic'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from .models import Team, SessionStage
            from challenges.models import Activity, Topic
            
            team = Team.objects.get(id=team_id)
            activity = Activity.objects.get(id=activity_id)
            session_stage = SessionStage.objects.get(id=session_stage_id)
            topic = Topic.objects.get(id=topic_id)
            
            # Obtener o crear progreso
            progress, created = TeamActivityProgress.objects.get_or_create(
                team=team,
                activity=activity,
                session_stage=session_stage,
                defaults={
                    'status': 'in_progress',
                    'started_at': timezone.now()
                }
            )
            
            # Actualizar tema seleccionado
            progress.selected_topic = topic
            # Si ya hay desafío seleccionado, marcar como completado
            if progress.selected_challenge:
                progress.status = 'completed'
                progress.completed_at = timezone.now()
                progress.progress_percentage = 100
            else:
                progress.status = 'in_progress'
            if not progress.started_at:
                progress.started_at = timezone.now()
            progress.save()
            
            # Recargar desde la base de datos para asegurar que se incluyan las relaciones
            # Importar logger para debugging
            import logging
            logger = logging.getLogger(__name__)
            
            progress.refresh_from_db()
            progress = TeamActivityProgress.objects.select_related(
                'selected_topic', 'selected_challenge'
            ).get(id=progress.id)
            
            logger.info(f"✅ Tema seleccionado guardado: Equipo {team.id}, Tema {topic.id}, Progress ID {progress.id}")
            
            serializer = self.get_serializer(progress)
            response_data = serializer.data
            logger.info(f"📤 Respuesta serializer - selected_topic: {response_data.get('selected_topic')}")
            return Response(response_data)
            
        except Team.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Activity.DoesNotExist:
            return Response(
                {'error': 'Actividad no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except SessionStage.DoesNotExist:
            return Response(
                {'error': 'Etapa de sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Topic.DoesNotExist:
            return Response(
                {'error': 'Tema no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], permission_classes=[])
    def select_challenge(self, request):
        """
        Seleccionar un desafío para una actividad
        No requiere autenticación (para tablets)
        """
        team_id = request.data.get('team')
        activity_id = request.data.get('activity')
        session_stage_id = request.data.get('session_stage')
        challenge_id = request.data.get('challenge')
        
        if not all([team_id, activity_id, session_stage_id, challenge_id]):
            return Response(
                {'error': 'Se requieren team, activity, session_stage y challenge'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from .models import Team, SessionStage
            from challenges.models import Activity, Challenge
            
            team = Team.objects.get(id=team_id)
            activity = Activity.objects.get(id=activity_id)
            session_stage = SessionStage.objects.get(id=session_stage_id)
            challenge = Challenge.objects.get(id=challenge_id)
            
            # Obtener o crear progreso
            progress, created = TeamActivityProgress.objects.get_or_create(
                team=team,
                activity=activity,
                session_stage=session_stage,
                defaults={
                    'status': 'in_progress',
                    'started_at': timezone.now()
                }
            )
            
            # Actualizar desafío seleccionado
            progress.selected_challenge = challenge
            
            # Automáticamente obtener y guardar el tema del desafío
            # El desafío siempre tiene un tema asociado
            if challenge.topic and not progress.selected_topic:
                progress.selected_topic = challenge.topic
            
            # Si el frontend también envía el tema (por compatibilidad), usarlo si no hay uno del desafío
            topic_id = request.data.get('topic')
            if topic_id and not progress.selected_topic:
                from challenges.models import Topic
                try:
                    topic = Topic.objects.get(id=topic_id)
                    progress.selected_topic = topic
                except Topic.DoesNotExist:
                    pass  # Si el tema no existe, continuar sin él
            
            # Si hay tema seleccionado (del desafío o enviado), marcar como completado
            if progress.selected_topic:
                progress.status = 'completed'
                progress.completed_at = timezone.now()
                progress.progress_percentage = 100
            else:
                progress.status = 'in_progress'
            if not progress.started_at:
                progress.started_at = timezone.now()
            progress.save()
            
            # Recargar desde la base de datos para asegurar que se incluyan las relaciones
            progress.refresh_from_db()
            progress = TeamActivityProgress.objects.select_related(
                'selected_topic', 'selected_challenge'
            ).get(id=progress.id)
            
            serializer = self.get_serializer(progress)
            return Response(serializer.data)
            
        except Team.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Activity.DoesNotExist:
            return Response(
                {'error': 'Actividad no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except SessionStage.DoesNotExist:
            return Response(
                {'error': 'Etapa de sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Challenge.DoesNotExist:
            return Response(
                {'error': 'Desafío no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], permission_classes=[])
    def upload_prototype(self, request):
        """
        Subir imagen del prototipo Lego
        No requiere autenticación (para tablets)
        
        Requiere:
        - team: ID del equipo
        - activity: ID de la actividad
        - session_stage: ID de la etapa de sesión
        - image: Archivo de imagen (FormData)
        """
        team_id = request.data.get('team')
        activity_id = request.data.get('activity')
        session_stage_id = request.data.get('session_stage')
        image_file = request.FILES.get('image')
        
        if not all([team_id, activity_id, session_stage_id]):
            return Response(
                {'error': 'Se requieren team, activity y session_stage'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not image_file:
            return Response(
                {'error': 'Se requiere un archivo de imagen'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar tamaño de archivo (5MB máximo)
        if image_file.size > settings.IMAGE_UPLOAD_MAX_SIZE:
            return Response(
                {'error': f'El archivo es demasiado grande. Máximo: {settings.IMAGE_UPLOAD_MAX_SIZE / 1024 / 1024}MB'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar tipo de archivo
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if image_file.content_type not in allowed_types:
            return Response(
                {'error': 'Tipo de archivo no permitido. Use JPEG, PNG o WEBP'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from .models import Team, SessionStage
            from challenges.models import Activity
            
            team = Team.objects.get(id=team_id)
            activity = Activity.objects.get(id=activity_id)
            session_stage = SessionStage.objects.get(id=session_stage_id)
            
            # Obtener o crear progreso
            progress, created = TeamActivityProgress.objects.get_or_create(
                team=team,
                activity=activity,
                session_stage=session_stage,
                defaults={
                    'status': 'submitted',
                    'progress_percentage': 100,
                    'started_at': timezone.now()
                }
            )
            
            # Procesar y guardar imagen
            try:
                # Abrir imagen con PIL para validar y optimizar
                img = Image.open(image_file)
                
                # Convertir a RGB si es necesario (para JPEG)
                if img.mode in ('RGBA', 'LA', 'P'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                    img = background
                
                # Redimensionar si es muy grande (máximo 1920x1920)
                max_size = (1920, 1920)
                if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                    img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Guardar en buffer
                from io import BytesIO
                buffer = BytesIO()
                img_format = 'JPEG'
                img.save(buffer, format=img_format, quality=85, optimize=True)
                buffer.seek(0)
                
                # Generar nombre único para el archivo
                import uuid
                file_extension = 'jpg'
                filename = f'prototypes/{team.id}_{session_stage.id}_{uuid.uuid4().hex[:8]}.{file_extension}'
                
                # Guardar en el sistema de archivos
                saved_path = default_storage.save(filename, ContentFile(buffer.read()))
                
                # Construir URL
                image_url = f"{settings.MEDIA_URL}{saved_path}"
                
            except Exception as img_error:
                return Response(
                    {'error': f'Error al procesar imagen: {str(img_error)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Si ya había una imagen, eliminar la anterior
            if progress.prototype_image_url and not created:
                old_path = progress.prototype_image_url.replace(settings.MEDIA_URL, '')
                if default_storage.exists(old_path):
                    default_storage.delete(old_path)
            
            # Actualizar progreso
            progress.prototype_image_url = image_url
            progress.status = 'submitted'
            progress.progress_percentage = 100
            if not progress.started_at:
                progress.started_at = timezone.now()
            progress.completed_at = timezone.now()
            progress.save()
            
            # Reload para incluir relaciones
            progress.refresh_from_db()
            progress = TeamActivityProgress.objects.select_related(
                'team', 'session_stage__stage', 'activity', 'selected_topic', 'selected_challenge'
            ).get(id=progress.id)
            
            serializer = self.get_serializer(progress)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Team.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Activity.DoesNotExist:
            return Response(
                {'error': 'Actividad no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except SessionStage.DoesNotExist:
            return Response(
                {'error': 'Etapa de sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], permission_classes=[])
    def save_pitch(self, request):
        """
        Guardar el formulario de pitch (Etapa 4)
        """
        team_id = request.data.get('team_id')
        activity_id = request.data.get('activity_id')
        session_stage_id = request.data.get('session_stage_id')
        pitch_intro_problem = request.data.get('pitch_intro_problem', '')
        pitch_solution = request.data.get('pitch_solution', '')
        pitch_closing = request.data.get('pitch_closing', '')
        
        if not all([team_id, activity_id, session_stage_id]):
            return Response(
                {'error': 'Faltan datos necesarios (team_id, activity_id, session_stage_id)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from .models import Team, SessionStage
            from challenges.models import Activity
            
            team = Team.objects.get(id=team_id)
            activity = Activity.objects.get(id=activity_id)
            session_stage = SessionStage.objects.get(id=session_stage_id)
            
            # Obtener o crear progreso
            progress, created = TeamActivityProgress.objects.get_or_create(
                team=team,
                activity=activity,
                session_stage=session_stage,
                defaults={
                    'status': 'in_progress',
                    'started_at': timezone.now(),
                    'progress_percentage': 0
                }
            )
            
            # Actualizar campos del pitch
            progress.pitch_intro_problem = pitch_intro_problem
            progress.pitch_solution = pitch_solution
            progress.pitch_closing = pitch_closing
            
            # Si todos los campos están completos, marcar como completado
            if pitch_intro_problem and pitch_solution and pitch_closing:
                progress.status = 'completed'
                progress.progress_percentage = 100
                if not progress.completed_at:
                    progress.completed_at = timezone.now()
            else:
                # Calcular porcentaje de completitud
                fields_completed = sum([bool(pitch_intro_problem), bool(pitch_solution), bool(pitch_closing)])
                progress.progress_percentage = int((fields_completed / 3) * 100)
                progress.status = 'in_progress'
            
            if not progress.started_at:
                progress.started_at = timezone.now()
            
            progress.save()
            
            # Reload para incluir relaciones
            progress.refresh_from_db()
            progress = TeamActivityProgress.objects.select_related(
                'team', 'session_stage__stage', 'activity', 'selected_topic', 'selected_challenge'
            ).get(id=progress.id)
            
            serializer = self.get_serializer(progress)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Team.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Activity.DoesNotExist:
            return Response(
                {'error': 'Actividad no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except SessionStage.DoesNotExist:
            return Response(
                {'error': 'Etapa de sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TabletViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Tablets
    """
    queryset = Tablet.objects.all()
    serializer_class = TabletSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['tablet_code']


class TabletConnectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Conexiones de Tablets
    """
    queryset = TabletConnection.objects.all()
    serializer_class = TabletConnectionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tablet', 'team', 'game_session']
    search_fields = ['tablet__tablet_code', 'team__name', 'game_session__room_code']

    def get_queryset(self):
        return TabletConnection.objects.select_related('tablet', 'team', 'game_session')

    @action(detail=False, methods=['post'], permission_classes=[])
    def connect(self, request):
        """
        Conectar una tablet a una sesión de juego
        No requiere autenticación (público para tablets)
        
        Requiere:
        - room_code: Código de la sala
        - tablet_code: Código de la tablet
        """
        room_code = request.data.get('room_code')
        tablet_code = request.data.get('tablet_code')
        
        if not room_code or not tablet_code:
            return Response(
                {'error': 'Se requiere room_code y tablet_code'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Normalizar códigos (eliminar espacios, convertir a mayúsculas)
        room_code = str(room_code).strip().upper()
        tablet_code = str(tablet_code).strip().upper()
        
        try:
            # Buscar sesión de juego
            game_session = GameSession.objects.get(room_code=room_code)
            
            # Verificar que la sesión esté activa (lobby o running)
            if game_session.status not in ['lobby', 'running']:
                return Response(
                    {
                        'error': 'La sesión ya ha finalizado',
                        'status': game_session.status,
                        'ended_at': game_session.ended_at
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Si la sesión está en 'running', solo permitir reconexión de tablets ya conectadas
            if game_session.status == 'running':
                # Verificar si la tablet ya estaba conectada a esta sesión
                existing_connection = TabletConnection.objects.filter(
                    tablet__tablet_code__iexact=tablet_code,
                    game_session=game_session,
                    disconnected_at__isnull=True
                ).first()
                
                if not existing_connection:
                    return Response(
                        {'error': 'No se pueden conectar nuevas tablets. El juego ya ha comenzado.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Buscar tablet (case-insensitive)
            try:
                tablet = Tablet.objects.get(tablet_code__iexact=tablet_code, is_active=True)
            except Tablet.DoesNotExist:
                return Response(
                    {'error': 'Código de tablet inválido o tablet inactiva'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Verificar si la tablet ya está conectada a esta sesión
            existing_connection = TabletConnection.objects.filter(
                tablet=tablet,
                game_session=game_session,
                disconnected_at__isnull=True
            ).first()
            
            if existing_connection:
                # Ya está conectada, retornar información existente
                serializer = TabletConnectionSerializer(existing_connection)
                team = existing_connection.team
                team_serializer = TeamSerializer(team)
                return Response({
                    'connection': serializer.data,
                    'team': team_serializer.data,
                    'game_session': {
                        'id': game_session.id,
                        'room_code': game_session.room_code,
                        'status': game_session.status
                    },
                    'message': 'Tablet ya conectada a esta sesión'
                }, status=status.HTTP_200_OK)
            
            # Buscar un equipo sin tablet conectada
            teams = game_session.teams.all()
            available_team = None
            
            for team in teams:
                has_active_connection = TabletConnection.objects.filter(
                    team=team,
                    game_session=game_session,
                    disconnected_at__isnull=True
                ).exists()
                
                if not has_active_connection:
                    available_team = team
                    break
            
            if not available_team:
                return Response(
                    {'error': 'Todos los equipos ya tienen una tablet conectada'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Crear conexión
            connection = TabletConnection.objects.create(
                tablet=tablet,
                team=available_team,
                game_session=game_session
            )
            
            serializer = TabletConnectionSerializer(connection)
            team_serializer = TeamSerializer(available_team)
            
            return Response({
                'connection': serializer.data,
                'team': team_serializer.data,
                'game_session': {
                    'id': game_session.id,
                    'room_code': game_session.room_code,
                    'status': game_session.status
                },
                'message': 'Tablet conectada exitosamente'
            }, status=status.HTTP_201_CREATED)
            
        except GameSession.DoesNotExist:
            return Response(
                {'error': 'Código de sala inválido'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error inesperado: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def disconnect(self, request, pk=None):
        """Desconectar una tablet"""
        connection = self.get_object()
        if connection.disconnected_at is not None:
            return Response(
                {'error': 'La tablet ya está desconectada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        connection.disconnected_at = timezone.now()
        connection.save()
        serializer = self.get_serializer(connection)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_team(self, request):
        """Obtener conexiones de tablets por equipo"""
        team_id = request.query_params.get('team')
        game_session_id = request.query_params.get('game_session')
        
        queryset = self.get_queryset()
        
        if team_id:
            queryset = queryset.filter(team_id=team_id)
        if game_session_id:
            queryset = queryset.filter(game_session_id=game_session_id)
        
        # Solo conexiones activas
        queryset = queryset.filter(disconnected_at__isnull=True)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[])
    def status(self, request):
        """
        Obtener estado de conexión de una tablet
        No requiere autenticación
        """
        connection_id = request.query_params.get('connection_id')
        
        if not connection_id:
            return Response(
                {'error': 'Se requiere connection_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            connection = TabletConnection.objects.select_related('tablet', 'team', 'game_session').get(id=connection_id)
            serializer = TabletConnectionSerializer(connection)
            
            team = connection.team
            game_session = connection.game_session
            team_serializer = TeamSerializer(team)
            
            # Obtener personalización del equipo
            personalization = None
            try:
                personalization = team.personalization
            except:
                pass
            
            return Response({
                'connection': serializer.data,
                'team': team_serializer.data,
                'game_session': {
                    'id': game_session.id,
                    'room_code': game_session.room_code,
                    'status': game_session.status
                },
                'personalization': {
                    'team_members_know_each_other': personalization.team_members_know_each_other if personalization else None
                } if personalization else None
            })
        except TabletConnection.DoesNotExist:
            return Response(
                {'error': 'Conexión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )


class TeamRouletteAssignmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Asignaciones de Retos de Ruleta
    """
    queryset = TeamRouletteAssignment.objects.all()
    serializer_class = TeamRouletteAssignmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['team', 'session_stage', 'roulette_challenge', 'status']
    search_fields = ['team__name', 'roulette_challenge__description']
    ordering_fields = ['assigned_at', 'accepted_at', 'completed_at']
    ordering = ['-assigned_at']

    def get_queryset(self):
        return TeamRouletteAssignment.objects.select_related(
            'team', 'session_stage', 'roulette_challenge', 'validated_by__user'
        )

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Aceptar un reto de ruleta"""
        assignment = self.get_object()
        if assignment.status != 'assigned':
            return Response(
                {'error': 'El reto no está en estado asignado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        assignment.status = 'accepted'
        assignment.accepted_at = timezone.now()
        assignment.save()
        serializer = self.get_serializer(assignment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Rechazar un reto de ruleta"""
        assignment = self.get_object()
        if assignment.status != 'assigned':
            return Response(
                {'error': 'El reto no está en estado asignado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        assignment.status = 'rejected'
        assignment.rejected_at = timezone.now()
        assignment.save()
        serializer = self.get_serializer(assignment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def validate(self, request, pk=None):
        """Validar completación de un reto (por profesor)"""
        assignment = self.get_object()
        if assignment.status not in ['accepted', 'completed']:
            return Response(
                {'error': 'El reto debe estar aceptado para ser validado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        assignment.status = 'completed'
        assignment.completed_at = timezone.now()
        assignment.validated_by = request.user.professor
        assignment.save()
        
        # Crear transacción de tokens
        TokenTransaction.objects.create(
            team=assignment.team,
            game_session=assignment.session_stage.game_session,
            session_stage=assignment.session_stage,
            amount=assignment.token_reward,
            source_type='roulette_challenge',
            source_id=assignment.id,
            reason=f'Reto de ruleta completado: {assignment.roulette_challenge.description[:50]}',
            awarded_by=request.user.professor
        )
        
        # Actualizar tokens del equipo
        assignment.team.tokens_total += assignment.token_reward
        assignment.team.save()
        
        serializer = self.get_serializer(assignment)
        return Response(serializer.data)


class TokenTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para Transacciones de Tokens (solo lectura)
    """
    queryset = TokenTransaction.objects.all()
    serializer_class = TokenTransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['team', 'game_session', 'session_stage', 'source_type']
    search_fields = ['team__name', 'game_session__room_code', 'reason']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_queryset(self):
        return TokenTransaction.objects.select_related(
            'team', 'game_session', 'session_stage', 'awarded_by__user'
        )


class PeerEvaluationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Evaluaciones Peer
    """
    queryset = PeerEvaluation.objects.all()
    serializer_class = PeerEvaluationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['evaluator_team', 'evaluated_team', 'game_session']
    search_fields = ['evaluator_team__name', 'evaluated_team__name', 'game_session__room_code']
    ordering_fields = ['submitted_at', 'total_score']
    ordering = ['-submitted_at']

    def get_queryset(self):
        return PeerEvaluation.objects.select_related(
            'evaluator_team', 'evaluated_team', 'game_session'
        )
    
    def get_permissions(self):
        """
        Permite leer sin autenticación para tablets
        Permite crear sin autenticación para tablets
        """
        if self.action in ['list', 'retrieve', 'create', 'for_professor', 'for_team']:
            return []  # Sin autenticación para tablets
        return super().get_permissions()
    
    def create(self, request, *args, **kwargs):
        """
        Crear una evaluación peer (desde tablets)
        """
        evaluator_team_id = request.data.get('evaluator_team_id')
        evaluated_team_id = request.data.get('evaluated_team_id')
        game_session_id = request.data.get('game_session_id')
        criteria_scores = request.data.get('criteria_scores', {})
        feedback = request.data.get('feedback', '')
        
        if not all([evaluator_team_id, evaluated_team_id, game_session_id]):
            return Response(
                {'error': 'Faltan datos necesarios (evaluator_team_id, evaluated_team_id, game_session_id)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from .models import Team, GameSession
            from django.utils import timezone
            
            evaluator_team = Team.objects.get(id=evaluator_team_id)
            evaluated_team = Team.objects.get(id=evaluated_team_id)
            game_session = GameSession.objects.get(id=game_session_id)
            
            # No permitir que un equipo se evalúe a sí mismo
            if evaluator_team_id == evaluated_team_id:
                return Response(
                    {'error': 'Un equipo no puede evaluarse a sí mismo'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calcular puntuación total (suma de todos los criterios)
            total_score = sum(criteria_scores.values()) if isinstance(criteria_scores, dict) else 0
            
            # Calcular tokens otorgados (por ejemplo, 1 token por cada 10 puntos)
            tokens_awarded = max(0, total_score // 10)
            
            # Verificar si ya existe una evaluación
            existing_evaluation = PeerEvaluation.objects.filter(
                evaluator_team=evaluator_team,
                evaluated_team=evaluated_team,
                game_session=game_session
            ).first()
            
            if existing_evaluation:
                # Actualizar evaluación existente
                existing_evaluation.criteria_scores = criteria_scores
                existing_evaluation.total_score = total_score
                existing_evaluation.tokens_awarded = tokens_awarded
                existing_evaluation.feedback = feedback
                existing_evaluation.save()
                evaluation = existing_evaluation
            else:
                # Crear nueva evaluación
                evaluation = PeerEvaluation.objects.create(
                    evaluator_team=evaluator_team,
                    evaluated_team=evaluated_team,
                    game_session=game_session,
                    criteria_scores=criteria_scores,
                    total_score=total_score,
                    tokens_awarded=tokens_awarded,
                    feedback=feedback
                )
            
            # Otorgar tokens al equipo evaluado
            if tokens_awarded > 0:
                from .models import TokenTransaction, SessionStage
                
                # Obtener el session_stage de la Etapa 4
                session_stage = SessionStage.objects.filter(
                    game_session=game_session,
                    stage__number=4
                ).first()
                
                if session_stage:
                    # Verificar si ya se otorgaron tokens por esta evaluación
                    existing_transaction = TokenTransaction.objects.filter(
                        team=evaluated_team,
                        game_session=game_session,
                        session_stage=session_stage,
                        source_type='peer_evaluation',
                        source_id=evaluation.id
                    ).exists()
                    
                    if not existing_transaction:
                        # Crear transacción de tokens
                        TokenTransaction.objects.create(
                            team=evaluated_team,
                            game_session=game_session,
                            session_stage=session_stage,
                            amount=tokens_awarded,
                            source_type='peer_evaluation',
                            source_id=evaluation.id,
                            reason=f'Evaluación peer: {evaluator_team.name} → {evaluated_team.name}',
                            awarded_by=None  # Sistema automático
                        )
                        
                        # Actualizar tokens del equipo evaluado
                        evaluated_team.tokens_total += tokens_awarded
                        evaluated_team.save()
            
            # Verificar si se evaluó al último equipo y todas las evaluaciones están completadas
            # Esto marca la actividad como completada
            try:
                from challenges.models import Activity
                
                # Obtener el session_stage de la Etapa 4
                session_stage = SessionStage.objects.filter(
                    game_session=game_session,
                    stage__number=4
                ).first()
                
                if session_stage and session_stage.presentation_order:
                    # Obtener la actividad de presentación pitch
                    presentation_activity = Activity.objects.filter(
                        stage__number=4,
                        activity_type__name__icontains='presentación'
                    ).first()
                    
                    if presentation_activity:
                        # Contar cuántos equipos hay en total
                        total_teams = len(session_stage.presentation_order)
                        
                        # Contar cuántas evaluaciones se han completado para el equipo evaluado
                        # Cada equipo debe ser evaluado por todos los demás equipos
                        evaluations_received = PeerEvaluation.objects.filter(
                            evaluated_team=evaluated_team,
                            game_session=game_session
                        ).count()
                        
                        # Si todas las evaluaciones están completadas (todos los demás equipos evaluaron)
                        if evaluations_received >= (total_teams - 1):
                            # Marcar la actividad como completada para el equipo evaluado
                            progress, created = TeamActivityProgress.objects.get_or_create(
                                team=evaluated_team,
                                activity=presentation_activity,
                                session_stage=session_stage,
                                defaults={
                                    'status': 'completed',
                                    'progress_percentage': 100,
                                    'completed_at': timezone.now()
                                }
                            )
                            
                            if not created:
                                progress.status = 'completed'
                                progress.progress_percentage = 100
                                if not progress.completed_at:
                                    progress.completed_at = timezone.now()
                                progress.save()
                            
                            print(f'✅ [Backend] Actividad de presentación marcada como completada para equipo {evaluated_team.name}')
            except Exception as e:
                print(f'⚠️ [Backend] Error al verificar completitud de actividad: {str(e)}')
            
            serializer = self.get_serializer(evaluation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Team.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except GameSession.DoesNotExist:
            return Response(
                {'error': 'Sesión de juego no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], permission_classes=[])
    def for_professor(self, request):
        """
        Obtener todas las evaluaciones de una sesión (para el profesor)
        """
        game_session_id = request.query_params.get('game_session_id')
        
        if not game_session_id:
            return Response(
                {'error': 'Se requiere game_session_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            game_session = GameSession.objects.get(id=game_session_id)
            evaluations = PeerEvaluation.objects.filter(
                game_session=game_session
            ).select_related('evaluator_team', 'evaluated_team')
            
            serializer = self.get_serializer(evaluations, many=True)
            return Response(serializer.data)
        except GameSession.DoesNotExist:
            return Response(
                {'error': 'Sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], permission_classes=[])
    def for_team(self, request):
        """
        Obtener evaluaciones recibidas por un equipo (para tablets)
        """
        team_id = request.query_params.get('team_id')
        game_session_id = request.query_params.get('game_session_id')
        
        if not team_id or not game_session_id:
            return Response(
                {'error': 'Se requieren team_id y game_session_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            team = Team.objects.get(id=team_id)
            game_session = GameSession.objects.get(id=game_session_id)
            
            evaluations = PeerEvaluation.objects.filter(
                evaluated_team=team,
                game_session=game_session
            ).select_related('evaluator_team', 'evaluated_team')
            
            serializer = self.get_serializer(evaluations, many=True)
            return Response(serializer.data)
        except Team.DoesNotExist:
            return Response(
                {'error': 'Equipo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        except GameSession.DoesNotExist:
            return Response(
                {'error': 'Sesión no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )


class TeamBubbleMapViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Bubble Maps de Equipos
    """
    queryset = TeamBubbleMap.objects.all()
    serializer_class = TeamBubbleMapSerializer
    permission_classes = []
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['team', 'session_stage']

    def get_permissions(self):
        """
        Permite acceso sin autenticación para tablets
        """
        if self.action in ['create', 'update', 'partial_update', 'retrieve', 'list']:
            return []
        return super().get_permissions()

    def get_queryset(self):
        return TeamBubbleMap.objects.select_related('team', 'session_stage__stage')
