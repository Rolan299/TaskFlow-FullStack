
-- ==========================================
-- TASKFLOW FULL STACK
-- Script de estructura de base de datos
-- PostgreSQL
-- ==========================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    titulo VARCHAR(120) NOT NULL,
    completada BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tareas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- Índice para consultar tareas por usuario
CREATE INDEX IF NOT EXISTS idx_tareas_usuario
ON tareas(usuario_id);
