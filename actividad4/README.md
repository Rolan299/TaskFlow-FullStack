
# TaskFlow Inventario
## Actividad 4 - Desarrollo Full Stack

### Descripción

TaskFlow Inventario es una aplicación web para administrar
productos mediante operaciones CRUD, autenticación JWT y
almacenamiento en MongoDB Atlas.

Cada usuario registrado puede consultar, crear, actualizar
y eliminar exclusivamente sus propios productos.

### Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- HTML5, CSS3 y JavaScript
- Jest y Supertest
- GitHub Actions
- Render

### Funcionalidades principales

1. Registro de nuevos usuarios.
2. Inicio y cierre de sesión.
3. Protección de rutas mediante JWT.
4. Creación de productos.
5. Consulta de productos.
6. Actualización de productos.
7. Eliminación de productos.
8. Búsqueda de productos.
9. Indicadores de existencias y valor del inventario.
10. Separación de productos por usuario.

### Modelo de datos

**Usuario**
- _id: identificador único.
- nombre: nombre del usuario.
- correo: correo electrónico único.
- passwordHash: contraseña protegida mediante bcrypt.
- createdAt y updatedAt: fechas de registro.

**Producto**
- _id: identificador único.
- nombre: nombre del producto.
- descripcion: descripción del producto.
- precio: precio unitario.
- stock: unidades disponibles.
- usuario: referencia al propietario.
- createdAt y updatedAt: fechas de registro.

Relación: un usuario puede tener muchos productos,
pero cada producto pertenece a un único usuario.

### Requisitos previos

- Node.js y npm.
- Acceso a MongoDB Atlas.
- Variables de entorno configuradas.

### Instalación

Desde la raíz del repositorio:

```bash
npm ci
```

Crear el archivo `actividad4/.env` utilizando
`actividad4/.env.example` como referencia.

Configurar:

- MONGODB_URI: cadena de conexión de MongoDB Atlas.
- JWT_SECRET: clave secreta para firmar los tokens JWT.
- PORT: puerto local, por ejemplo 3001.

Nunca publicar credenciales reales en GitHub.

### Ejecución local

Desde la raíz del repositorio:

```bash
npm run start:a4
```

Abrir:

http://localhost:3001

### Pruebas automatizadas

Ejecutar:

```bash
npm run test:a4
```

Se incluyen 15 pruebas automatizadas:

- 9 pruebas de productos.
- 6 pruebas de autenticación.

Las pruebas utilizan simulaciones de Mongoose
para no modificar los datos reales de MongoDB Atlas.

### Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/auth/registro | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/productos | Consultar productos |
| POST | /api/productos | Crear producto |
| PUT | /api/productos/:id | Actualizar producto |
| DELETE | /api/productos/:id | Eliminar producto |
| GET | /api/health | Comprobar estado del servidor |

Las rutas de productos requieren un token JWT válido
mediante el encabezado:

Authorization: Bearer TOKEN

### Integración y despliegue continuos

GitHub Actions ejecuta las pruebas automatizadas
cuando se publican cambios en la rama:

actividad-4-productos-mongodb

Render está configurado para desplegar la aplicación
después de que las comprobaciones de CI se aprueben.

Comando de construcción:

npm ci

Comando de inicio:

npm run start:a4

### Aplicación publicada

https://taskflow-inventario-a4.onrender.com

### Repositorio

https://github.com/Rolan299/TaskFlow-FullStack

Rama correspondiente a la Actividad 4:

actividad-4-productos-mongodb

### Consideraciones de seguridad

- Las contraseñas se almacenan como hashes bcrypt.
- La autenticación utiliza tokens JWT.
- Los productos se filtran por usuario autenticado.
- Las credenciales privadas se gestionan mediante variables
  de entorno y no se incluyen en el repositorio.

### Proyecto académico

Desarrollado para la materia Desarrollo Full Stack,
como evidencia de implementación de una aplicación web
con base de datos NoSQL, autenticación y CI/CD.
