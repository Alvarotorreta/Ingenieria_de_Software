# Guía: Creación de Administrador y Registro de Profesores

Esta guía explica el proceso completo para crear un administrador y gestionar el registro de profesores en el sistema **Misión Emprende UDD**.

---

## 📋 Tabla de Contenidos

1. [Crear un Administrador en Django Admin](#1-crear-un-administrador-en-django-admin)
2. [Configurar el Usuario Administrador](#2-configurar-el-usuario-administrador)
3. [Acceder al Panel de Administración](#3-acceder-al-panel-de-administración)
4. [Generar Código de Acceso para Profesor](#4-generar-código-de-acceso-para-profesor)
5. [Registro del Profesor](#5-registro-del-profesor)

---

## 1. Crear un Administrador en Django Admin

### Paso 1.1: Acceder a Django Admin

1. Abre tu navegador web
2. Navega a: **`http://localhost:8000/admin`**
3. Inicia sesión con un superusuario existente (o crea uno si es la primera vez)

### Paso 1.2: Crear un Nuevo Usuario

1. En el panel de Django Admin, busca la sección **"AUTHENTICATION AND AUTHORIZATION"**
2. Haz clic en **"Usuarios"**
3. Haz clic en el botón **"Add user"** (arriba a la derecha)
4. Completa los campos:
   - **Username**: Ingresa un nombre de usuario único (ej: `admin1`)
   - **Password**: Crea una contraseña segura
   - **Password confirmation**: Confirma la contraseña
5. Haz clic en **"Save"**

---

## 2. Configurar el Usuario Administrador

### Paso 2.1: Agregar Correo Electrónico

1. Después de crear el usuario, serás redirigido a la página de edición del usuario
2. En la sección **"Personal info"**, completa:
   - **Email address**: Ingresa el correo del administrador (ej: `admin@udd.cl`)
   - **First name**: (Opcional) Nombre del administrador
   - **Last name**: (Opcional) Apellido del administrador
3. Haz clic en **"Save"**

### Paso 2.2: Marcar como Staff

1. En la misma página de edición del usuario, busca la sección **"Permissions"**
2. Marca la casilla **"Staff status"** ✅
   - Esto permite que el usuario acceda al panel de administración de Django
3. **Importante**: También puedes marcar **"Superuser status"** si deseas dar permisos completos
4. Haz clic en **"Save"**

### Paso 2.3: Crear el Perfil de Administrador

1. En el panel de Django Admin, busca la sección **"USERS"**
2. Haz clic en **"Administrators"**
3. Haz clic en el botón **"Add administrator"** (arriba a la derecha)
4. En el campo **"User"**, selecciona el usuario que acabas de crear
5. Haz clic en **"Save"**

✅ **¡Listo!** El administrador está creado y configurado.

---

## 3. Acceder al Panel de Administración

### Paso 3.1: Iniciar Sesión en el Panel

1. Abre tu navegador web
2. Navega a: **`http://localhost:5173/admin/login`**
3. Ingresa las credenciales:
   - **Correo**: El correo electrónico que configuraste (ej: `admin@udd.cl`)
   - **Contraseña**: La contraseña que creaste
4. Haz clic en **"Ingresar"**

### Paso 3.2: Navegar al Panel de Administración

1. Después de iniciar sesión, serás redirigido automáticamente a: **`http://localhost:5173/admin/panel`**
2. Verás el panel principal con las siguientes opciones:
   - **Jugar / Nueva Sesión**: Redirige al panel del profesor
   - **Historial**: Ver historial de todas las sesiones
   - **Objetivos**: Objetivos de aprendizaje
   - **Actualizar Juego**: Configurar el juego
   - **Dashboard**: Estadísticas y métricas
   - **Profesores**: Gestionar acceso de profesores ⭐

---

## 4. Generar Código de Acceso para Profesor

### Paso 4.1: Acceder a Gestión de Profesores

1. En el panel de administración (`http://localhost:5173/admin/panel`)
2. Haz clic en la tarjeta **"Profesores"** (ícono de graduación)
3. Serás redirigido a: **`http://localhost:5173/admin/professors`**

### Paso 4.2: Generar Código de Acceso

1. En la página de **"Gestión de Profesores"**, haz clic en el botón **"Generar Código"** (arriba a la derecha)
2. Se mostrará un formulario con los siguientes campos:
   - **Correo UDD** ⭐ (Requerido): Debe ser un correo `@udd.cl` (ej: `profesor@udd.cl`)
   - **Nombre**: (Opcional) Nombre del profesor
   - **Apellido**: (Opcional) Apellido del profesor
3. Completa el formulario:
   ```
   Correo UDD: profesor@udd.cl
   Nombre: Juan
   Apellido: Pérez
   ```
4. Haz clic en **"Generar Código"**

### Paso 4.3: Enviar el Código al Profesor

1. Después de generar el código, se abrirá automáticamente tu cliente de correo (mailto)
2. El correo ya estará pre-formateado con:
   - **Asunto**: "🎓 Código de Acceso - Misión Emprende UDD"
   - **Cuerpo**: Incluye el código de acceso y las instrucciones
3. Revisa el correo y haz clic en **"Enviar"**

### Paso 4.4: Verificar Códigos Generados

1. En la página de **"Gestión de Profesores"**, puedes cambiar a la pestaña **"Códigos de Acceso"**
2. Verás una lista de todos los códigos generados con su estado:
   - **Pendiente**: El código aún no ha sido usado
   - **Usado**: El código ya fue utilizado
   - **Registrado**: El profesor ya se registró con este código

---

## 5. Registro del Profesor

### Paso 5.1: Acceder a la Página de Registro

1. El profesor debe abrir su navegador web
2. Navegar a: **`http://localhost:5173/profesor/registro`**
   - O puede hacer clic en el enlace que viene en el correo electrónico

### Paso 5.2: Completar el Formulario de Registro

1. El profesor debe completar el formulario con:
   - **Correo Electrónico**: El mismo correo que recibió el código (ej: `profesor@udd.cl`)
   - **Código de Acceso**: El código de 6 dígitos que recibió por correo (ej: `123456`)
   - **Nombre**: Su nombre
   - **Apellidos**: Sus apellidos
   - **Contraseña**: Crear una contraseña segura
   - **Confirmar Contraseña**: Confirmar la contraseña

2. Ejemplo de formulario completado:
   ```
   Correo Electrónico: profesor@udd.cl
   Código de Acceso: 123456
   Nombre: Juan
   Apellidos: Pérez
   Contraseña: ********
   Confirmar Contraseña: ********
   ```

3. Haz clic en **"Registrarse"**

### Paso 5.3: Inicio de Sesión Automático

1. Después del registro exitoso, el sistema iniciará sesión automáticamente
2. El profesor será redirigido a: **`http://localhost:5173/profesor/panel``
3. ¡Listo! El profesor ya puede crear sesiones de juego

### Paso 5.4: Iniciar Sesión Manualmente (Opcional)

Si el profesor necesita iniciar sesión más tarde:

1. Navegar a: **`http://localhost:5173/profesor/login`**
2. Ingresar:
   - **Correo Electrónico**: `profesor@udd.cl`
   - **Contraseña**: La contraseña que creó durante el registro
3. Haz clic en **"Ingresar"**

---

## 🔐 Resumen del Flujo Completo

```
1. Django Admin (8000/admin)
   └─> Crear Usuario
   └─> Agregar Correo
   └─> Marcar como Staff
   └─> Crear Administrador

2. Panel Admin (5173/admin/panel)
   └─> Iniciar Sesión con correo y contraseña
   └─> Ir a "Profesores"
   └─> Generar Código de Acceso
   └─> Enviar correo al profesor

3. Registro Profesor (5173/profesor/registro)
   └─> Ingresar correo y código de acceso
   └─> Completar formulario
   └─> ¡Registro exitoso!

4. Login Profesor (5173/profesor/login)
   └─> Ingresar correo y contraseña
   └─> Acceder al panel del profesor
```

---

## ⚠️ Notas Importantes

### Para Administradores:

- El correo del administrador debe ser único
- El usuario debe tener **Staff status** activado para acceder al panel
- Los códigos de acceso son de **6 dígitos** y se generan automáticamente
- Cada código solo puede ser usado **una vez**
- El correo del profesor **debe ser @udd.cl**

### Para Profesores:

- El código de acceso es **único** y solo puede usarse una vez
- El correo usado en el registro debe coincidir con el correo que recibió el código
- Si olvida su contraseña, debe contactar al administrador
- El código de acceso expira cuando se usa (no hay expiración por tiempo)

---

## 🆘 Solución de Problemas

### Error: "Ya existe un código de acceso pendiente para este correo"
- **Solución**: El profesor debe usar el código que ya se generó, o el administrador debe esperar a que se use

### Error: "El correo debe ser de la universidad (@udd.cl)"
- **Solución**: Solo se aceptan correos con dominio `@udd.cl`

### Error: "Ya existe un usuario registrado con este correo electrónico"
- **Solución**: El profesor ya está registrado, debe usar la opción de login en lugar de registro

### Error: "El código de acceso es requerido para registrarse"
- **Solución**: El profesor debe ingresar el código de 6 dígitos que recibió por correo

---

## 📞 Contacto

Si tienes problemas durante el proceso, contacta al administrador del sistema o revisa los logs del servidor.

---

**Última actualización**: Diciembre 2024



