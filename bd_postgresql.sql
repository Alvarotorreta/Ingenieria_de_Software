


-- =========================================================
-- Base de datos: Juego de Emprendimiento (PostgreSQL)
-- Autor: Modelo acordado (Alumno N:N Equipo por AlumnoEquipo)
-- =========================================================

-- Recomendado: ejecutar dentro de una transacción
BEGIN;

-- ============================================
-- GRUPO 1: Tablas base sin dependencias (FK)
-- ============================================

CREATE TABLE Facultad (
    id_facultad      SERIAL PRIMARY KEY,
    nombre           VARCHAR(255) NOT NULL
);

CREATE TABLE TipoUsuario (
    id_tipoUsuario       SERIAL PRIMARY KEY,
    nombreTipoUsuario    VARCHAR(100) NOT NULL
);

CREATE TABLE Etapa (
    id_etapa        SERIAL PRIMARY KEY,
    nombre_etapa    VARCHAR(255) NOT NULL,
    descripcion     TEXT
);

CREATE TABLE TipoPregunta (
    id_tipoPregunta SERIAL PRIMARY KEY,
    descripcion     TEXT
);

-- ============================================
-- GRUPO 2: Tablas que dependen del GRUPO 1
-- ============================================

CREATE TABLE Carrera (
    id_carrera   SERIAL PRIMARY KEY,
    nombre       VARCHAR(255) NOT NULL,
    id_facultad  INT NOT NULL,
    CONSTRAINT fk_carrera_facultad
        FOREIGN KEY (id_facultad) REFERENCES Facultad(id_facultad)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Usuario (
    id_usuario      SERIAL PRIMARY KEY,
    nombre          VARCHAR(255) NOT NULL,
    correo_udd      VARCHAR(255) NOT NULL UNIQUE,
    contrasena      VARCHAR(255) NOT NULL,   -- almacena HASH
    id_tipoUsuario  INT NOT NULL,
    CONSTRAINT fk_usuario_tipousuario
        FOREIGN KEY (id_tipoUsuario) REFERENCES TipoUsuario(id_tipoUsuario)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Tema (
    id_tema      SERIAL PRIMARY KEY,
    nombre_tema  VARCHAR(255) NOT NULL,
    descripcion  TEXT,
    id_facultad  INT NOT NULL,
    CONSTRAINT fk_tema_facultad
        FOREIGN KEY (id_facultad) REFERENCES Facultad(id_facultad)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE TipoActividad (
    id_tipoActividad  SERIAL PRIMARY KEY,
    codigo            VARCHAR(50) NOT NULL,
    descripcion       TEXT,
    id_etapa          INT NOT NULL,
    CONSTRAINT fk_tipoactividad_etapa
        FOREIGN KEY (id_etapa) REFERENCES Etapa(id_etapa)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Pregunta (
    id_pregunta      SERIAL PRIMARY KEY,
    descripcion      TEXT NOT NULL,
    id_tipoPregunta  INT NOT NULL,
    CONSTRAINT fk_pregunta_tipopregunta
        FOREIGN KEY (id_tipoPregunta) REFERENCES TipoPregunta(id_tipoPregunta)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ============================================
-- GRUPO 3: Tablas que dependen del GRUPO 2
-- ============================================

CREATE TABLE Sala (
    id_sala         SERIAL PRIMARY KEY,
    codigo_acceso   VARCHAR(50) NOT NULL UNIQUE,
    fecha_creacion  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado          VARCHAR(20) NOT NULL DEFAULT 'en_juego',
    -- estados sugeridos: 'en_juego', 'finalizado', 'programada'
    CONSTRAINT chk_sala_estado
        CHECK (estado IN ('programada', 'en_juego', 'finalizado')),

    id_usuario      INT NOT NULL,       -- profesor/creador
    id_carrera      INT NOT NULL,

    CONSTRAINT fk_sala_usuario
        FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_sala_carrera
        FOREIGN KEY (id_carrera)  REFERENCES Carrera(id_carrera)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Desafio (
    id_desafio     SERIAL PRIMARY KEY,
    nombre_desafio VARCHAR(255) NOT NULL,
    descripcion    TEXT,
    id_tema        INT NOT NULL,
    CONSTRAINT fk_desafio_tema
        FOREIGN KEY (id_tema) REFERENCES Tema(id_tema)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Actividad (
    id_actividad       SERIAL PRIMARY KEY,
    nombre             VARCHAR(255) NOT NULL,
    descripcion        TEXT,
    estado             VARCHAR(20) NOT NULL DEFAULT 'en_juego',
    CONSTRAINT chk_actividad_estado
        CHECK (estado IN ('programada', 'en_juego', 'finalizado')),
    imagen_url         VARCHAR(2048),
    id_etapa           INT NOT NULL,
    id_tipo_actividad  INT NOT NULL,
    CONSTRAINT fk_actividad_etapa
        FOREIGN KEY (id_etapa) REFERENCES Etapa(id_etapa)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_actividad_tipo
        FOREIGN KEY (id_tipo_actividad) REFERENCES TipoActividad(id_tipoActividad)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Alumno (
    id_alumno    SERIAL PRIMARY KEY,
    nombre       VARCHAR(255) NOT NULL,
    carrera      VARCHAR(255),
    correo_udd   VARCHAR(255) NOT NULL UNIQUE
    -- Nota: SIN id_equipo aquí (relación N:N se maneja en AlumnoEquipo)
);

-- ============================================
-- GRUPO 4: Tablas que dependen del GRUPO 3
-- ============================================

CREATE TABLE Equipo (
    id_equipo      SERIAL PRIMARY KEY,
    nombre_equipo  VARCHAR(255) NOT NULL,
    modalidad      BOOLEAN NOT NULL DEFAULT FALSE,  -- se conocen? true/false
    puntaje_total  INT NOT NULL DEFAULT 0,
    CONSTRAINT chk_equipo_puntaje
        CHECK (puntaje_total >= 0),

    id_sala        INT NOT NULL,
    id_desafio     INT NOT NULL,

    CONSTRAINT fk_equipo_sala
        FOREIGN KEY (id_sala)    REFERENCES Sala(id_sala)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_equipo_desafio
        FOREIGN KEY (id_desafio) REFERENCES Desafio(id_desafio)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ========================================================
-- GRUPO 5: Tablas de unión y finales (dependen G3 y G4)
-- ========================================================

CREATE TABLE AlumnoEquipo (
    id_alumno  INT NOT NULL,
    id_equipo  INT NOT NULL,
    PRIMARY KEY (id_alumno, id_equipo),
    CONSTRAINT fk_alumnoequipo_alumno
        FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_alumnoequipo_equipo
        FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Respuesta (
    id_respuesta   SERIAL PRIMARY KEY,
    respuesta_texto  TEXT,
    imagen_url       VARCHAR(2048),
    id_equipo        INT NOT NULL,
    id_actividad     INT NOT NULL,
    CONSTRAINT fk_respuesta_equipo
        FOREIGN KEY (id_equipo)    REFERENCES Equipo(id_equipo)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_respuesta_actividad
        FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE RegistroTokens (
    id_registro_tokens SERIAL PRIMARY KEY,
    emisor            VARCHAR(255),  -- "profe", "equipo N", "sistema", etc.
    receptor          VARCHAR(255),  -- receptor libre (ej. "equipo N", "todos")
    cantidad_tokens   INT NOT NULL,
    CONSTRAINT chk_tokens_cantidad CHECK (cantidad_tokens >= 0),
    motivo            TEXT,
    id_equipo         INT NOT NULL,      -- equipo que recibe/afecta el saldo
    id_actividad      INT NOT NULL,      -- en qué actividad se originó
    CONSTRAINT fk_tokens_equipo
        FOREIGN KEY (id_equipo)    REFERENCES Equipo(id_equipo)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_tokens_actividad
        FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE RespuestaEncuesta (
    id_respuestaEncuesta SERIAL PRIMARY KEY,
    respuesta   TEXT,
    id_alumno   INT NOT NULL,
    id_pregunta INT NOT NULL,
    CONSTRAINT fk_respencuesta_alumno
        FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_respencuesta_pregunta
        FOREIGN KEY (id_pregunta) REFERENCES Pregunta(id_pregunta)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ============================================
-- ÍNDICES recomendados para performance (FKs)
-- ============================================

CREATE INDEX idx_carrera_facultad         ON Carrera(id_facultad);
CREATE INDEX idx_usuario_tipousuario      ON Usuario(id_tipoUsuario);
CREATE INDEX idx_tema_facultad            ON Tema(id_facultad);
CREATE INDEX idx_tipoactividad_etapa      ON TipoActividad(id_etapa);
CREATE INDEX idx_pregunta_tipopregunta    ON Pregunta(id_tipoPregunta);

CREATE INDEX idx_sala_usuario             ON Sala(id_usuario);
CREATE INDEX idx_sala_carrera             ON Sala(id_carrera);
CREATE INDEX idx_desafio_tema             ON Desafio(id_tema);
CREATE INDEX idx_actividad_etapa          ON Actividad(id_etapa);
CREATE INDEX idx_actividad_tipo           ON Actividad(id_tipo_actividad);

CREATE INDEX idx_equipo_sala              ON Equipo(id_sala);
CREATE INDEX idx_equipo_desafio           ON Equipo(id_desafio);

CREATE INDEX idx_alumnoequipo_alumno      ON AlumnoEquipo(id_alumno);
CREATE INDEX idx_alumnoequipo_equipo      ON AlumnoEquipo(id_equipo);

CREATE INDEX idx_respuesta_equipo         ON Respuesta(id_equipo);
CREATE INDEX idx_respuesta_actividad      ON Respuesta(id_actividad);

CREATE INDEX idx_tokens_equipo            ON RegistroTokens(id_equipo);
CREATE INDEX idx_tokens_actividad         ON RegistroTokens(id_actividad);

CREATE INDEX idx_respencuesta_alumno      ON RespuestaEncuesta(id_alumno);
CREATE INDEX idx_respencuesta_pregunta    ON RespuestaEncuesta(id_pregunta);

COMMIT;
