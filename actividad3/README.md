
# TaskFlow — Actividad 3
## Desarrollo Full Stack | Universidad Tecmilenio

**Alumno:** Rolando López Valle  
**Matrícula:** 07205425  
**Actividad:** 3 — API RESTful con Node.js y Express.js

## Descripción

API RESTful para gestionar tareas mediante operaciones CRUD,
utilizando Node.js, Express.js y almacenamiento asíncrono en
archivos JSON con fs.promises.

Incluye autenticación mediante JWT, contraseñas protegidas
con bcryptjs, validación de datos y manejo centralizado de errores.

## Tecnologías

- Node.js
- Express.js
- body-parser
- jsonwebtoken
- bcryptjs
- fs.promises
- JavaScript
- Git y GitHub

## Instalación

1. Clonar el repositorio y seleccionar la rama:

   git clone https://github.com/Rolan299/TaskFlow-FullStack.git
   cd TaskFlow-FullStack
   git switch actividad-3-api-json

2. Instalar dependencias:

   npm install

3. Crear el archivo:

   actividad3/data/usuarios.json

   Con el contenido:

   []

   Puede copiarse desde usuarios.example.json.

4. Crear un archivo .env en la raíz del proyecto
   y definir una clave secreta:

   JWT_SECRET=REEMPLAZAR_POR_CLAVE_ALEATORIA_SEGURA

5. Iniciar el servidor:

   node actividad3/server.js

6. Acceder a:

   http://localhost:3000/health

## Rutas disponibles

### Públicas

POST /register
Registra un usuario con nombre, correo y contraseña.

POST /login
Valida las credenciales y devuelve un token JWT.

GET /health
Comprueba el funcionamiento del servidor.

### Protegidas

GET /tareas
Consulta las tareas almacenadas.

POST /tareas
Crea una tarea con título y descripción.

PUT /tareas/:id
Actualiza título, descripción y estado.

DELETE /tareas/:id
Elimina una tarea por su identificador.

## Autenticación

Las rutas de tareas requieren el encabezado:

Authorization: Bearer TOKEN_JWT

El token se obtiene mediante POST /login.

## Almacenamiento

Las tareas se almacenan en:

actividad3/data/tareas.json

Los usuarios se almacenan localmente en:

actividad3/data/usuarios.json

Se utilizan fs.promises y async/await para realizar
operaciones de lectura y escritura asíncronas.

## Manejo de errores

La API utiliza middleware personalizado para responder
con códigos HTTP apropiados:

- 400: Datos inválidos o JSON incorrecto.
- 401: Token no proporcionado o credenciales incorrectas.
- 403: Token inválido o expirado.
- 404: Ruta o tarea inexistente.
- 409: Usuario duplicado.
- 500: Error interno del servidor.

## Debugging

Para iniciar el servidor en modo depuración:

node --inspect actividad3/server.js

Puede utilizarse Visual Studio Code para conectar
el depurador, colocar breakpoints e inspeccionar variables.

## Proyecto original

La rama main conserva TaskFlow Full Stack con PostgreSQL,
frontend y despliegue en Render.

Esta Actividad 3 se desarrolla en una rama independiente
para implementar el almacenamiento JSON requerido.
