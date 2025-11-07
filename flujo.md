# Misión Emprende - Documentación del Juego

## Descripción General

El juego se trata sobre **emprendimiento** para que alumnos de primer año de la universidad puedan y estén más conscientes del emprendimiento y de que es una opción viable.

### Explicación Breve del Juego

El juego consta de **4 etapas**:

1. **Trabajo en equipo** - Para conocerse o fortalecer compañerismo o romper el hielo
2. **Empatía** - Para conocer problemas y abordar un caso o desafío
3. **Creatividad** - Crear una solución con legos
4. **Comunicación** - Crear y comunicar pitch

### Configuración del Juego

- **Guía requerido**: El juego necesita de un **profesor** que ayude, gestione y guíe el juego
- **Dispositivos**: El juego se jugará en **tablets** (1 por cada grupo)
- **Tamaño de grupos**: 
  - Mínimo: 3 estudiantes por grupo
  - Máximo: 8 estudiantes por grupo
- **Cantidad de grupos**: Pueden haber 3 o 4 grupos simultáneos

---

## Flujo Detallado — Profesor (Host)

### 1. Acceso y Panel

#### Registro
- Correo UDD
- Código de acceso( codigo numerico)
- Nombre
- Apellido
- Contraseña

#### Login
- Correo + contraseña (JWT/session) #es importante que no se le cierre la sesion

#### Panel Principal
Panel con métricas resumidas, historial de sesiones y accesos directos:
- **Crear sala**
- **Historial**
- **Objetivos de aprendizaje**
- **Tutorial**
- metricas como por ejemplo cantidad de juegos realizados. cantidad de alumnos que han participado

#### Objetivos de Aprendizaje (Apartado)
- Muestra objetivos pedagógicos generales y por etapa:
  - **Etapa 1** — Trabajo en equipo
  - **Etapa 2** — Empatía
  - **Etapa 3** — Creatividad
  - **Etapa 4** — Comunicación
- Criterios de evaluación vinculados a cada objetivo (participación, calidad del pitch, feedback)
- Cómo interpretar métricas (tokens, tiempos, participación)
- Recomendaciones didácticas, tiempos estimados y recursos asociados

#### Tutorial (Apartado)
- Video explicativo paso a paso (crear sala, subir XLSX, lobby, iniciar etapas, validar retos, ver resultados)
- Guía escrita con capturas y checklist previo a la sesión:
  - XLSX correcto
  - Tablets listas
  - QR listos
  - Material físico
- FAQ y soluciones rápidas: reconexiones, códigos inválidos, qué hacer si falta un equipo


---

### 2. Crear Sala (Único Punto — Automático)

#### Formulario de Creación
- Seleccionar **Facultad** → **Carrera** → **Curso**( basicamente facultad sirve de filtro para carrera, y carrera sirve de filtro para curso)
- Adjuntar **XLSX** con los siguientes datos:
  - Nombre completo
  - Correo UDD
  - RUT

#### Creación Automática de Equipos
- El profesor **NO configura equipos manualmente** en este paso
- El sistema aplica una regla de cálculo preestablecida para crear equipos automáticamente respetando:
  - Tamaño mínimo por equipo = **3**
  - Tamaño máximo por equipo = **8**
  - Número de equipos optimizado para rellenar dentro del rango


#### Resultado
- Equipos generados con nombre/color provisionales
- Sala en estado **"lobby"**


### 3. Lobby de Sala (Paso Separado y Obligatorio Antes de Iniciar)

#### Vista del Lobby
- Lista de equipos (color, nombre, miembros) #cada equipo se llamara por default equipo verde
- Estado de tablets (conectadas/no conectadas) 


#### codigo y qr
la sala tendra un codigo de sala para que pueda acceder la tablet y tambien un qr con el link

#### Gestión de Tablets
- el profesor solo podra iniciar juego si ya cada grupo tiene conectado su tablet
- puede desconectar tablets(por si se conecta un dispositivo diferente)

#### Revisión de Equipos
- El profesor puede mover/intercambiar estudiantes entre equipos manualmente si desea (corrige la asignación automática) y cambiar todos de manera aleatoria




### 4. Inicio de la Partida y Control Central

#### Inicio del Juego
- El profesor pulsa **"Iniciar juego"** y la sesión pasa a estado `running`
- Alternativamente: el profesor inicia manualmente cada etapa y actividad
- una etapa tiene varias actividades, cada actividad tiene un temporizador asociado
-  el profesor puede seguir a otra actividad solo si el temporizador termino o todos entregaron la actividad
- al inicio de cada etapa aparece una explicacion de la etapa

#### Control Central
El profesor puede:
- Iniciar etapas/actividades
- Supervisar progreso:#es crucial que el profe vea lo que estan haciendo por ejemplo hay una sopa de letra ver cuantas palabras ha encontrado cada equipo
  - Actividad actual
  - % completado
  - Respuestas
- Cerrar actividades
- Reordenar presentaciones

#### Notificaciones
- Todas las tablets reciben:
  - `room_state`
  - `stage_started`
  - `activity_started`
- Según el control del profesor # no entendi esto, pero basicamente el profesor controla la sesion si apreta continuar todas las tablet iran a la siguiente actividad

---

### 5. Desarrollo por Etapa y Actividades

#### Antes de Cada Etapa
- El profesor inicia la etapa
- El objetivo y descripción se muestran en todas las tablets

#### Actividades Típicas por Etapa
etapa 1. trabajo en equipo:
- explicacion etapa 1
- Personalización( el profe ve si ya actualizaron su nombre, y si se conocen o no) "en progreso" o "listo"
- Minijuego/presentación ( el profe ve el avance del grupo si estan en minijuego por ejemplo 4/7 encontradas o presentaciones no listas)
- rulera fin etapa 1( ruleta de retos)cada equipo tira la ruleta y decide si hacer la el reto a cambio de tokens el profesor es el que visualiza si se cumplieron los retos y valida la asignacion de tokens
-resultados etapa 1
etapa 2 ; empatia
- explicacion etapa 2
- seleccionar tema(cada facultad tiene temas asociados)( el profe ve los temas que seleccionaron los equipos)
- ve el desafio(historia de usuario del problema)(el profesor ve el desafio que escogieron)
- Bubble map: el profesor ve como van rellenando el bubble map
- ruleta fin etapa 2
-resultados 
etapa 3 ; creatividad
- explicacion etapa 3
- Subida de prototipo lego: el profesor vera la imagen cuando la suban
- ruleta
- resultados
etapa 4; comunicacion
- explicacion etapa 4
- Formulario de pitch: el profesor vera cuando tengan listo el formulario de pitch
- el sistema crea automaticamente el orden de presentacion de los grupos(ademas el profesor puede modificar ese orden), cada grupo es evaluado despues de la presentacion
- ruleta
-resultados

fin y reflexion

- se entrega un qr donde los estudiantes accede de su dispositivo personal y responde encuesta de feedback y satisfaccion del juego


---



### 7. Resultados y Snapshots

#### Vista de Resultados
Al concluir cada etapa el profesor lanza la vista de resultados:
- Tokens por equipo total y etapa
- Ranking



### 8. Manejo de Excepciones y Control de Sesiones

#### Tablet Desconectada
- Notificación al profesor
- Opciones disponibles:
  - Expulsar
  - Esperar reconexión
  - Reasignar tablet

#### Profesor Desconectado
- Sesión pausada
- Opción configurable para:
  - Transferir host a admin/co-host
  - Esperar reconexión

---

## Flujo Detallado — Administrador

### 1. Acceso y Panel

#### Registro/ no tiene registro se crea desde el mismo backend superusuario


#### Login/propio login/diferente al del profe
- Correo + contraseña (JWT/session)
- Autenticación con permisos de administrador
- Sesión persistente (no se cierra automáticamente)

#### Panel Principal
Panel con todas las funcionalidades del profesor **más**:
- **Crear sala** (igual que profesor)
- **Historial** (ver todas las sesiones(cada sesion con metricas avanzadas))
-**home** puede ver metricas de todas las sesiones del juego (dashboard)
- **Gestión de contenido** (tutorial, objetivos de aprendizaje,temas, desafíos, retos, etc.)
- **Configuración del sistema** (parámetros globales)

---

### 2. Funcionalidades del Profesor (Herencia)

El administrador puede realizar **todas las acciones del profesor**:
- Crear salas
- Gestionar lobby
- Controlar sesiones en tiempo real
- Supervisar equipos y actividades
- Validar retos y asignar tokens
- Ver resultados y snapshots
- Manejar excepciones

---

### 3. Historial Extendido de Sesiones

#### Vista de Historial
- **Filtros disponibles**:
  - Por profesor (ver sesiones de un profesor específico)
  - Por fecha (rango de fechas)
  - Por facultad/carrera/curso
  - Por estado (completadas, en progreso, canceladas)
- **Lista de todas las sesiones**:
  - Sesiones realizadas por el administrador
  - Sesiones realizadas por todos los profesores
  - Información básica: fecha, profesor, cantidad de estudiantes, equipos, estado

#### Detalle de Sesión
Al seleccionar una sesión, el administrador puede ver:
- **Información general**:
  - Profesor que la condujo
  - Fecha y hora
  - Duración total
  - Cantidad de estudiantes y equipos
  - Estado final
- **Resultados por equipo**:
  - Tokens totales y por etapa
  - Ranking final
  - Evaluaciones recibidas
- **Snapshots de cada etapa**:
  - Estado de cada actividad
  - Tiempos de completación
  - Respuestas y entregas

---

### 4. Métricas Avanzadas y Análisis

#### Métricas de Juego (Dashboard Principal)

##### Métricas Generales
- **Cantidad de juegos realizados** (total e histórico)
- **Cantidad de alumnos que han participado** (único y total)
- **Cantidad de profesores activos**
- **Tasa de finalización** (sesiones completadas vs iniciadas)
- **Promedio de duración** de sesiones completas

##### Métricas por Etapa
- **Tiempo promedio en cada actividad**:
  - Etapa 1: Personalización, Minijuego/Presentación
  - Etapa 2: Selección de tema, Ver desafío, Bubble Map
  - Etapa 3: Subida de prototipo
  - Etapa 4: Formulario de pitch, Presentaciones
- **Puntajes promedio por actividad**:
  - Tokens ganados por equipo en cada actividad
  - Distribución de tokens por etapa
  - Comparación entre equipos
- **Tasa de completación**:
  - % de equipos que completan cada actividad
  - Actividades más problemáticas (mayor tiempo, menor completación)

##### Métricas por Actividad Específica

**Etapa 1 - Trabajo en Equipo:**
- Tiempo promedio en personalización
- Tiempo promedio en minijuego/presentación
- % de equipos que se conocen vs no se conocen
- Progreso en minijuegos (ej: palabras encontradas promedio)
- Tasa de aceptación de retos de la ruleta

**Etapa 2 - Empatía:**
- Temas más seleccionados (ranking)
- Tiempo promedio en selección de tema
- Tiempo promedio leyendo/analizando desafío
- Tiempo promedio en creación de bubble map
- Cantidad de burbujas promedio por equipo
- Tasa de aceptación de retos

**Etapa 3 - Creatividad:**
- Tiempo promedio en construcción del prototipo
- Tiempo promedio en subida de foto
- % de equipos que suben foto vs no suben
- Tasa de aceptación de retos

**Etapa 4 - Comunicación:**
- Tiempo promedio en formulario de pitch
- Tiempo promedio de presentación por equipo
- Puntajes de evaluación peer (promedio, distribución)
- Tasa de aceptación de retos finales

##### Métricas Detalladas de Retos (Ruleta)

**Métricas Generales de Retos:**
- Cantidad total de retos asignados (por etapa y total)
- Tasa de aceptación global (retos aceptados vs rechazados)
- Tasa de completación (retos completados vs aceptados)
- Tiempo promedio desde asignación hasta aceptación/rechazo
- Tiempo promedio de completación de retos

**Métricas por Reto Individual:**
- Cantidad de veces que cada reto fue asignado
- Cantidad de veces que fue aceptado
- Cantidad de veces que fue rechazado
- Cantidad de veces que fue completado exitosamente
- Tasa de aceptación por reto (aceptados / asignados)
- Tasa de completación por reto (completados / aceptados)
- Tokens promedio ganados por reto
- Tokens totales distribuidos por cada reto

**Métricas por Tipo de Reto:**
- Físicos (flexiones, saltos, etc.)
- Mentales (preguntas, acertijos, etc.)
- Creativos (dibujos, actuaciones, etc.)
- Comparación de tasas de aceptación y completación por tipo

**Métricas por Etapa:**
- Retos más asignados por etapa (ranking)
- Retos más aceptados por etapa
- Retos más rechazados por etapa
- Retos con mayor tasa de completación por etapa
- Tokens promedio ganados por reto en cada etapa

**Análisis de Balance de Retos:**
- Retos con muy alta tasa de aceptación (posiblemente fáciles)
- Retos con muy baja tasa de aceptación (posiblemente difíciles o poco atractivos)
- Retos que nunca son aceptados
- Retos que siempre son completados (pueden necesitar mayor dificultad)
- Distribución de tokens por reto (identificar desbalances)

**Métricas de Efectividad:**
- Correlación entre tokens del reto y tasa de aceptación
- Retos más efectivos (alto % aceptación + alto % completación)
- Retos menos efectivos (bajo % aceptación o bajo % completación)
- Impacto de tokens en la decisión de aceptar/rechazar

**Gráficos Específicos de Retos:**
- Gráfico de barras: Tasa de aceptación por reto
- Gráfico de barras: Tasa de completación por reto
- Gráfico de dispersión: Tokens vs Tasa de aceptación
- Gráfico circular: Distribución de retos por tipo
- Gráfico de líneas: Evolución de aceptación de retos a lo largo del tiempo
- Heatmap: Tasa de aceptación por reto y por etapa

##### Gráficos y Visualizaciones

**Gráficos de Tiempo:**
- Gráfico de barras: Tiempo promedio por actividad
- Gráfico de líneas: Evolución del tiempo en actividades a lo largo del tiempo
- Heatmap: Tiempo por etapa y por actividad

**Gráficos de Puntajes:**
- Gráfico de barras: Tokens promedio por etapa
- Gráfico de distribución: Distribución de tokens entre equipos
- Gráfico de cajas (boxplot): Rango de tokens por etapa

**Gráficos de Participación:**
- Gráfico circular: % de equipos que completan cada actividad
- Gráfico de área apilada: Progreso de completación por etapa
- Gráfico de líneas: Tasa de finalización a lo largo del tiempo

**Gráficos de Evaluación:**
- Gráfico de barras: Evaluaciones promedio por criterio
- Gráfico de radar: Evaluación multidimensional del pitch
- Gráfico de dispersión: Correlación entre tokens y evaluación

##### Análisis Comparativo

**Comparación entre sesiones:**
- Comparar métricas de diferentes sesiones
- Identificar patrones y tendencias
- Detectar sesiones con mejor/peor rendimiento

**Comparación entre equipos:**
- Ranking histórico de equipos
- Comparación de tiempos y puntajes
- Identificar equipos con mejor desempeño

**Comparación entre profesores:**
- Métricas promedio por profesor
- Tasa de finalización por profesor
- Duración promedio de sesiones por profesor

##### Exportación de Datos
- Exportar métricas a CSV/XLSX
- Exportar gráficos como imágenes (PNG, SVG)
- Exportar reportes completos en PDF
- API para acceso programático a métricas

---

### 5. Gestión de Contenido del Juego

#### Gestión de Temas

**Crear Tema:**
- Formulario para crear nuevo tema:
  - Nombre del tema
  - Descripción
  - Asociar a facultad(es) específica(s)
  - Categoría o etiquetas
  - Estado (activo/inactivo)
  - Imagen opcional

**Modificar Tema:**
- Editar información del tema existente
- Cambiar asociación con facultades
- Activar/desactivar tema
- Ver estadísticas de uso (cuántas veces fue seleccionado)

**Eliminar Tema:**
- Eliminar tema del sistema
- Confirmación antes de eliminar
- Advertencia si el tema está siendo usado en sesiones activas
- Opción de archivar en lugar de eliminar

**Lista de Temas:**
- Vista de todos los temas disponibles
- Filtros por facultad, estado, categoría
- Búsqueda de temas
- Ordenamiento por nombre, uso, fecha de creación

#### Gestión de Desafíos (Historias de Usuario)

**Crear Desafío:**
- Formulario para crear nuevo desafío:
  - Título del desafío
  - Historia de usuario o caso de estudio (texto largo)
  - Asociar a tema específico
  - Nivel de dificultad (bajo, medio, alto)
  - Objetivos de aprendizaje asociados
  - Recursos adicionales (links, documentos)
  - Estado (activo/inactivo)

**Modificar Desafío:**
- Editar contenido del desafío
- Cambiar asociación con temas
- Ajustar nivel de dificultad
- Actualizar recursos
- Activar/desactivar desafío
- Ver estadísticas de uso

**Eliminar Desafío:**
- Eliminar desafío del sistema
- Confirmación y validaciones
- Opción de archivar

**Lista de Desafíos:**
- Vista de todos los desafíos
- Filtros por tema, dificultad, estado
- Búsqueda de desafíos
- Vista previa del contenido

#### Gestión de Retos (Ruleta)

**Crear Reto:**
- Formulario para crear nuevo reto:
  - Descripción del reto
  - Tipo de reto (físico, mental, creativo, etc.)
  - Dificultad estimada
  - Recompensa en tokens (rango: mínimo, máximo)
  - Etapa asociada (1, 2, 3, 4 o todas)
  - Estado (activo/inactivo)

**Modificar Reto:**
- Editar descripción del reto
- Ajustar recompensa en tokens
  - Cambiar asociación con etapas
  - Activar/desactivar reto
  - Ver estadísticas (cuántas veces fue asignado, aceptado, completado)

**Eliminar Reto:**
- Eliminar reto del sistema
- Confirmación antes de eliminar
- Opción de archivar

**Lista de Retos:**
- Vista de todos los retos disponibles
- Filtros por etapa, tipo, dificultad, estado
- Estadísticas de uso por reto
- Configuración de probabilidad de aparición (opcional)

#### Gestión de Minijuegos

**Configurar Minijuegos:**
- Lista de minijuegos disponibles (sopa de letras, etc.)
- Configurar parámetros:
  - Número de palabras en sopa de letras
  - Tiempo límite
  - Dificultad
- Activar/desactivar minijuegos
- Crear nuevos minijuegos (si aplica)

#### Gestión de Objetivos de Aprendizaje

**Crear/Modificar Objetivos:**
- Editar objetivos pedagógicos por etapa
- Agregar nuevos objetivos
- Asociar criterios de evaluación
- Modificar recomendaciones didácticas
- Actualizar tiempos estimados

#### Gestión de Configuraciones del Sistema

**Parámetros Globales:**
- Tamaño mínimo/máximo de equipos (actualmente 3-8)
- Duración predeterminada de actividades
- Tokens base por actividad
- Configuración de temporizadores
- Configuración de ruleta de retos
- Límites y restricciones del sistema

**Configuración de Facultades:**
- Agregar/modificar/eliminar facultades
- Agregar/modificar/eliminar carreras
- Agregar/modificar/eliminar cursos
- Asociar temas a facultades

---

### 6. Análisis y Toma de Decisiones

#### Dashboard de Toma de Decisiones

**Indicadores Clave (KPIs):**
- Actividades que toman más tiempo del esperado
- Actividades con baja tasa de completación
- Temas más/menos populares
- Retos con mayor/menor tasa de aceptación
- Equipos con mejor/peor desempeño

**Alertas y Recomendaciones:**
- Actividades que requieren ajuste de tiempo
- Temas que no se están utilizando
- Desafíos demasiado difíciles o fáciles
- **Retos que necesitan rebalanceo de tokens:**
  - Retos con muy alta tasa de aceptación pero tokens bajos (pueden aumentar tokens)
  - Retos con muy baja tasa de aceptación pero tokens altos (pueden reducir tokens o dificultad)
  - Retos que nunca son aceptados (necesitan revisión o eliminación)
  - Retos con desbalance entre tokens y dificultad
- **Retos que requieren ajuste:**
  - Retos demasiado fáciles (siempre completados)
  - Retos demasiado difíciles (baja tasa de completación)
  - Retos poco atractivos (baja tasa de aceptación)

**Análisis de Tendencias:**
- Evolución de tiempos a lo largo del tiempo
- Cambios en tasas de completación
- Patrones de uso de temas
- **Evolución de retos:**
  - Cambios en tasas de aceptación de retos a lo largo del tiempo
  - Tendencias de completación de retos
  - Patrones de uso de tipos de retos (físicos, mentales, creativos)
- Efectividad de cambios realizados en retos

#### Reportes de Mejora Continua

**Reportes de Análisis:**
- Análisis de cuellos de botella (actividades más lentas)
- Análisis de engagement (actividades más/menos populares)
- Análisis de balance (distribución de tokens)
- Análisis de contenido (temas y desafíos más efectivos)
- **Análisis de retos:**
  - Retos más efectivos (alto engagement y completación)
  - Retos menos efectivos (bajo engagement o completación)
  - Análisis de balance de tokens en retos
  - Distribución de retos por tipo y etapa
  - Correlación entre tokens y aceptación de retos

**Recomendaciones Automáticas:**
- Sugerencias de ajuste de tiempos
- Sugerencias de modificación de contenido
- Sugerencias de rebalanceo de tokens
- **Sugerencias específicas de retos:**
  - Retos que necesitan ajuste de tokens
  - Retos que necesitan ajuste de dificultad
  - Retos que deberían eliminarse o archivarse
  - Sugerencias de nuevos retos basados en gaps identificados
- Identificación de contenido obsoleto

---

### 7. Gestión de Usuarios (Profesores)

#### Lista de Profesores
- Ver todos los profesores registrados
- Filtrar por facultad, estado (activo/inactivo)
- Búsqueda de profesores

#### Crear/Modificar Profesor
- Crear cuenta de profesor (si tiene permisos)
- Modificar información de profesor existente
- Activar/desactivar cuenta de profesor
- Resetear contraseña

#### Estadísticas de Profesores
- Cantidad de sesiones realizadas por profesor
- Tasa de finalización por profesor
- Métricas promedio de sesiones por profesor

---

### 8. Exportación y Reportes

#### Exportación de Datos
- Exportar todas las sesiones a CSV/XLSX
- Exportar métricas detalladas
- Exportar análisis completos
- Generar reportes personalizados

#### Reportes Automáticos
- Reporte semanal de actividad
- Reporte mensual de métricas
- Reporte de uso de contenido
- Reporte de rendimiento del sistema

---

## Flujo Detallado — Tablet (Estudiantes)

### 1. Acceso a la Sala

#### Conexión Inicial
- El estudiante o grupo accede a la tablet y abre la web( accede aun link tipo misionemprendeudd.cl/juego)
- Ingresa el **código de sala** (`room_code`) o escanea el **QR** proporcionado por el profesor
- Ingresa el codigo de tablet(este es un codigo propio que tiene cada tablet para evitar que entre cualquier dispositivo)
- La tablet se conecta a la sala y muestra el nombre del equipo asignado (color, nombre provisional) en la esquina superior derecha aparecera el nombre del equipo y la cantidad de tokens actual

#### Pantalla de Espera
- Mientras el profesor gestiona el lobby, la tablet muestra:
  - Nombre del equipo
  - Color del equipo
  - Lista de miembros del equipo 
  - Estado: "Esperando a que el profesor inicie el juego"
  - Indicador de conexión (verde/rojo)

#### Notificación de Inicio
- Cuando el profesor inicia el juego, todas las tablets reciben la notificación
- La tablet muestra la transición a la primera etapa

---

### 2. Etapa 1: Trabajo en Equipo

#### Explicación de la Etapa 1: trabajo en equipo
- Al iniciar la etapa, la tablet muestra:
  - Objetivo de la etapa: "Conocerse o fortalecer compañerismo"
  - Descripción general de lo que harán
  - Duración estimada de la etapa

#### Actividad 1: Personalización
- La tablet muestra un formulario o pantalla donde cada miembro del equipo puede:
  - Ingresar o actualizar su nombre(nombre del equipo)
  - Indicar si se conocen o no (botones: "Ya nos conocemos" / "No nos conocemos")
- al, entregar esta actividad, El equipo puede ver los nombres nuevos de los otros equipos 
- Una vez que todos completan esta actividad, el estado cambia a "Listo"
- El profesor ve el estado en tiempo real ("En progreso" o "Listo", y el nombre actualizado y si se conocen(si es listo))

#### Actividad 2: Minijuego/Presentación
- La tablet muestra el minijuego(si se conocen) asignado (por ejemplo, sopa de letras)
- El equipo trabaja colaborativamente en el minijuego:
  - Pueden ver palabras encontradas (ej: "4/7 encontradas")
  - Progreso visible en tiempo real
  - Temporizador visible en pantalla
- Alternativamente, si es una presentación(si no se conocen):
  - cada integrante se presenta al equipo
  - Estado visible: "No listo" / "Listo"
- El profesor supervisa el avance en tiempo real

#### Actividad 3: Ruleta de Retos (Fin de Etapa)
- Al finalizar la etapa, la tablet muestra la ruleta de retos
- El equipo decide si quiere participar en el reto que les salio al tirar la ruleta:
  - La ruleta se ejecuta en el servidor y muestra el reto asignado
  - Se muestra la recompensa en tokens por completar el reto
  - El equipo decide si acepta o rechaza el reto
  - Si aceptan, deben completar el reto (actividad externa: tipo un integrante debe hacer 10 flexiones)
- El profesor valida si el reto fue cumplido y asigna tokens
- Los tokens aparecen en la pantalla del equipo

#### Resultados Etapa 1
- La tablet muestra:
  - Tokens ganados en esta etapa (que salga como puntaje total 27 y al lado +27 por ejemplo: que seria lo que obtuvieron en esa etapa)
  - Tokens totales acumulados
  - Ranking actualizado 
 

---

### 3. Etapa 2: Empatía

#### Explicación de la Etapa
- La tablet muestra:
  - Objetivo: "Conocer problemas y abordar un caso o desafío"
  - Descripción de la etapa de empatía
  - Instrucciones generales

#### Actividad 1: Seleccionar Tema
- La tablet muestra una lista de temas disponibles (filtrados según la facultad)
- El equipo selecciona un tema de interés
- Pueden ver una breve descripción de cada tema antes de seleccionar
- Una vez seleccionado, el tema se bloquea o marca como "seleccionado"
- El profesor ve qué temas seleccionó cada equipo

#### Actividad 2: Ver el Desafío (Historia de Usuario)
- La tablet muestra el desafío o problema asociado al tema seleccionado
- Presenta una historia de usuario o caso de estudio
- El equipo lee y analiza el problema
- Pueden tomar notas o marcar elementos importantes
- El profesor ve qué desafío escogió cada equipo

#### Actividad 3: Bubble Map
- La tablet muestra un canvas o área de trabajo para crear un "Bubble Map" (mapa mental)
- El equipo puede:
  - Agregar burbujas (ideas, conceptos, problemas)
  - En cada burbuja pueden agregar texto
- El profesor ve cómo van rellenando el bubble map en tiempo real


#### Actividad 4: Ruleta de Retos (Fin de Etapa)
- Similar a la etapa 1: ruleta de retos con opción de aceptar o rechazar
- Tokens asignados según validación del profesor

#### Resultados Etapa 2
- Tokens ganados y totales acumulados
- Ranking actualizado

---

### 4. Etapa 3: Creatividad

#### Explicación de la Etapa
- La tablet muestra:
  - Objetivo: "Crear una solución con legos"
  - Instrucciones para construir el prototipo físico
  - Tiempo estimado para la construcción

#### Actividad 1: Subida de Prototipo Lego
- El equipo construye físicamente el prototipo con legos (no en la tablet)
- Una vez terminado, la tablet muestra opciones para documentar:
  - Tomar foto(s) del prototipo con la cámara de la tablet
  - O subir imagen desde galería

- El equipo puede:
  - Previsualizar las fotos antes de subir
  - Confirmar y enviar
- Una vez subido, el profesor ve la imagen en su panel
- Estado visible: "No subido" / "Subido" / "En revisión"

#### Actividad 2: Ruleta de Retos (Fin de Etapa)
- Ruleta de retos con validación del profesor

#### Resultados Etapa 3
- Tokens ganados y totales acumulados
- Ranking actualizado

---

### 5. Etapa 4: Comunicación

#### Explicación de la Etapa
- La tablet muestra:
  - Objetivo: "Crear y comunicar pitch"
  - Importancia de la comunicación en emprendimiento
  - Estructura sugerida para el pitch

#### Actividad 1: Formulario de Pitch
- La tablet muestra un formulario estructurado para que el equipo cree el pitch:
  - Campo: intro-problema(etapa 2)
  - Campo: Solución (etapa 3)
  - Campo: cierre
- la idea es que hagan el guion para presentar
  

#### Actividad 2: Presentación del Pitch
- La tablet muestra:
  - Orden de presentación (generado automáticamente, visible después de que el profesor lo confirme)
  - "Tu turno" / "Esperando turno" / "Turno del equipo X"
  - Temporizador cuando es su turno
- Cuando es su turno:
  - El equipo presenta el pitch adelante
  - Pueden usar el prototipo y tablet como apoyo 
  - Después de presentar, el equipo vuelve a la pantalla de espera
- Durante otras presentaciones:
  - La tablet muestra el prototipo "imagen" subida por ese grupo
  
- Después de cada presentación:
  - El equipo puede evaluar al equipo que presentó 
  - Formulario de evaluación simple con criterios (entrega tokens)

#### Actividad 3: Ruleta de Retos (Fin de Etapa)
- Ruleta de retos final con validación del profesor

#### Resultados Etapa 4
- Tokens ganados y totales acumulados
- Ranking final
- Evaluaciones recibidas (si aplica)

---

### 6. Fin y Reflexión

#### Pantalla Final
- La tablet muestra:
  - Resumen general del juego
  - Tokens totales acumulados por el equipo
  - Posición final en el ranking
  - Logros o badges obtenidos (si aplica)
  - Mensaje de felicitación o reflexión

#### Encuesta de Feedback
- La tablet muestra un **QR** con el link a la encuesta
- Los estudiantes escanean el QR con su dispositivo personal (no la tablet)
- Acceden a la encuesta desde su celular/tablet personal
- Responden sobre:
  - Satisfacción con el juego
  - Feedback sobre las actividades
  - Sugerencias de mejora
  - Experiencia general

#### Desconexión
- Una vez finalizada la sesión, la tablet puede:
  - Mostrar pantalla de "Gracias por participar"
  - Permitir desconexión segura
  - O mantener conexión para futuras sesiones

---




