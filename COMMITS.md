# Historial de Commits - Misión Emprende

Este archivo contiene un registro de todos los commits realizados en el proyecto. Úsalo como referencia para volver a versiones anteriores.

---

## 📝 Instrucciones para volver a una versión

Para volver a un commit específico, usa el siguiente comando:

```bash
git checkout <HASH_COMPLETO>
```

Para volver a esa versión y crear una nueva rama:
```bash
git checkout -b nueva-rama <HASH_COMPLETO>
```

Para volver al commit más reciente después:
```bash
git checkout master
```

---

## 📚 Commits

### Commit #1
- **Hash completo:** `f491c866bcbddcf7a5f854f50a66535d764bc7fd`
- **Hash corto:** `f491c86`
- **Fecha:** 2025-11-25 18:54:13 -0300
- **Mensaje:** Versión inicial del proyecto Misión Emprende
- **Descripción:** Commit inicial con 181 archivos y 45,918 líneas de código
- **Para volver aquí:**
  ```bash
  git checkout f491c866bcbddcf7a5f854f50a66535d764bc7fd
  ```

### Commit #2
- **Hash completo:** `c8b70691c3dc1e78b8a7a2697a0450b07f6fef7b`
- **Hash corto:** `c8b7069`
- **Fecha:** 2025-11-25 19:59:01 -0300
- **Mensaje:** SOLUCION REFLEXION: Corregido contador de evaluaciones y mejorado diseño
- **Descripción:** 
  - Corregido problema del contador de evaluaciones (0/0 y 0/17 que no se actualizaba)
  - Mejorado diseño de reflexión para tablet (ancho max-w-6xl, sin scroll)
  - Agregado resumen de actividades completadas en reflexión del profesor
  - Implementada utilidad global para corregir encoding UTF-8 de textos
  - Agregado interceptor en API para corregir automáticamente encoding de respuestas
  - Corregido problema de caracteres especiales (Empatía, tildes, etc.) en toda la app
- **Para volver aquí:**
  ```bash
  git checkout c8b70691c3dc1e78b8a7a2697a0450b07f6fef7b
  ```

### Commit #3
- **Hash completo:** `434d99b1ef5b78036b913f554886a184c6d62bfb`
- **Hash corto:** `434d99b`
- **Fecha:** 2025-11-25 22:17:10 -0300
- **Mensaje:** Implementar gestión completa de Temas y Desafíos en panel admin
- **Descripción:**
  - Agregado CRUD completo de temas y desafíos en Etapa 2
  - Implementada vista de gestión con lista de temas y temporizador
  - Permitir editar temporizador de presentación individual (1:30) para Presentación del Pitch
  - Vista completa de edición de temas (nombre, descripción, icono, carreras disponibles)
  - Vista completa de edición de desafíos (título, descripción, icono, información de persona, imagen)
  - Funcionalidad para crear, editar y eliminar temas y desafíos
  - Eliminados campos innecesarios: URL imagen tema, nivel de dificultad, recursos adicionales, objetivos de aprendizaje
  - Actualizado backend para leer temporizador de presentación desde config_data de la actividad
- **Para volver aquí:**
  ```bash
  git checkout 434d99b1ef5b78036b913f554886a184c6d62bfb
  ```

### Commit #4
- **Hash completo:** `f0631c25fe58a7dd4df3ced8833ac660d409e2a8`
- **Hash corto:** `f0631c2`
- **Fecha:** 2025-11-26 00:56:06
- **Mensaje:** Agregar gráfico interactivo de juegos por facultades y carreras, mejorar gráficos temporales
- **Descripción:**
  - Agregar endpoints backend para juegos por facultad y carreras
  - Implementar gráfico interactivo con drill-down (facultad -> carreras)
  - Mejorar gráficos de series temporales: quitar animaciones problemáticas, agregar loader
  - Agregar manejo de estados de carga y mensajes cuando no hay datos
  - Crear nueva app Django `admin_dashboard` para métricas administrativas
  - Implementar modelos de cache para métricas de duración y selección
  - Agregar señales automáticas para actualizar métricas cuando ocurren eventos
  - Implementar dashboard completo con múltiples gráficos interactivos y métricas
- **Para volver aquí:**
  ```bash
  git checkout f0631c25fe58a7dd4df3ced8833ac660d409e2a8
  ```

### Commit #5
- **Hash completo:** `1f54494f07dfbd60152d916ddf3726724dc1b0f3`
- **Hash corto:** `1f54494`
- **Fecha:** 2025-11-26 22:58:17 -0300
- **Mensaje:** minijuego listo
- **Descripción:**
  - Corregido cálculo de `total_questions` en backend para siempre usar 5 (no el número de respuestas dadas)
  - Eliminadas secciones de progreso visual innecesarias en Presentacion.tsx y Minijuego.tsx
  - Eliminados botones de navegación "Parte 1", "Parte 2", "Parte 3" en Minijuego.tsx
  - Corregida vista del profesor para mostrar correctamente "1/5" en lugar de "1/1" para Conocimiento General
  - Mejorado manejo de errores y logging en submit_general_knowledge
  - Agregado logger al inicio de submit_general_knowledge para evitar errores
  - Frontend ahora siempre usa 5 como total de preguntas, independientemente del backend
- **Para volver aquí:**
  ```bash
  git checkout 1f54494f07dfbd60152d916ddf3726724dc1b0f3
  ```

### Commit #6
- **Hash completo:** `8db548eeddc4bcf8afa27636dc2993f5ef0f9bb0`
- **Hash corto:** `8db548e`
- **Fecha:** 2025-12-03 05:24:03 -0300
- **Mensaje:** feat: Mejoras en diseño y funcionalidad de actividades tablet
- **Descripción:**
  - Aplicado diseño azul consistente de tokens en todas las actividades de tablet (Personalizacion, Presentacion, Minijuego, BubbleMap, Prototipo, FormularioPitch, PresentacionPitch, SeleccionarTemaDesafio, Resultados)
  - Botón U-Bot con diseño rosado consistente en todas las actividades (mismo estilo que badge de tokens)
  - Corregido display de tokens en FormularioPitch (cambio de `tokens` a `tokens_total`)
  - Agregados modales U-Bot automáticos en Minijuego y Presentacion con mensajes específicos
  - Creados nuevos componentes de modales U-Bot: UBotPresentacionModal, UBotMinijuegoModal
  - Corregidos mensajes de U-Bot en Personalizacion (mensaje de registro), Presentacion (mensaje de 3 partes), Minijuego (mensaje de sincronización avanzada)
  - Mejoradas alertas de tokens en preguntas de conocimiento general (toast verde para correcto, rojo para incorrecto)
  - Actualizado mensaje de U-Bot en resultados finales (Etapa 4) con cantidad exacta de tokens para el ganador
  - Removida sección 'Actividades Completadas' de pantalla Reflexion del profesor
  - Mejorado mensaje de carga en Reflexion tablet (muestra "Cargando..." cuando totalEstudiantes es 0)
- **Para volver aquí:**
  ```bash
  git checkout 8db548eeddc4bcf8afa27636dc2993f5ef0f9bb0
  ```

---

*Última actualización: 2025-12-03*
