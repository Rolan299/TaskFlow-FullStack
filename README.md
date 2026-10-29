
# TaskFlow Full Stack

Aplicación web para la gestión de tareas personales, desarrollada como proyecto académico de la materia Desarrollo Full Stack de Tecmilenio.

## Tecnologías utilizadas

- Frontend: HTML5, CSS3 y JavaScript.
- Backend: Node.js y Express.
- Base de datos: PostgreSQL.
- Autenticación: JSON Web Token (JWT).
- Seguridad de contraseñas: bcryptjs.
- Configuración: dotenv.

## Funcionalidades

- Registro de usuarios.
- Inicio de sesión mediante JWT.
- Creación, consulta, actualización y eliminación de tareas.
- Marcado de tareas como completadas.
- Filtros por estado.
- Estadísticas de productividad.
- Aislamiento de tareas por usuario.
- Diseño adaptable a dispositivos móviles.

## Requisitos

- Node.js y npm.
- PostgreSQL.
- Una base de datos llamada `taskflow_db`.

## Instalación

1. Clonar o descargar el repositorio.
2. Abrir una terminal en la carpeta del proyecto.
3. Instalar las dependencias:

   npm install

4. Copiar `.env.example` como `.env` y configurar las variables de entorno.
5. Crear las tablas `usuarios` y `tareas` en PostgreSQL.
6. Iniciar el servidor:

   npm start

7. Abrir en el navegador:

   http://localhost:3000

Nota: en Windows PowerShell, si existe una restricción para ejecutar npm.ps1, se puede utilizar `npm.cmd install` y `npm.cmd start`.

## Endpoints de la API

| Método | Ruta | Descripción | JWT |
|---|---|---|---|
| POST | /api/auth/registro | Registrar usuario | No |
| POST | /api/auth/login | Iniciar sesión | No |
| GET | /api/tareas | Consultar tareas propias | Sí |
| POST | /api/tareas | Crear tarea | Sí |
| PUT | /api/tareas/:id | Actualizar tarea propia | Sí |
| DELETE | /api/tareas/:id | Eliminar tarea propia | Sí |
| GET | /api/health | Verificar conexión del servidor y base de datos | No |

## Autenticación

Las rutas protegidas requieren el encabezado:

Authorization: Bearer TOKEN_JWT

El token se genera al iniciar sesión y tiene una vigencia de una hora.

## Seguridad

- Contraseñas almacenadas mediante hash bcrypt.
- Consultas SQL parametrizadas.
- Validación de datos.
- Rutas protegidas mediante JWT.
- Operaciones restringidas al propietario de cada tarea.
- Variables privadas almacenadas en `.env`, excluidas del repositorio.

## Pruebas realizadas

Se verificaron las operaciones CRUD, la autenticación JWT, las restricciones de acceso entre usuarios, la persistencia en PostgreSQL y la visualización en dispositivos móviles.

## Autor

Rolando López Valle  
Matrícula: 07205425  
Universidad Tecmilenio  
Materia: Desarrollo Full Stack
