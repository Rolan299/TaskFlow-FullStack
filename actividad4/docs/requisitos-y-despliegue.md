
# TaskFlow Inventario
## Requisitos y justificación tecnológica

### 1. Descripción general

TaskFlow Inventario es una aplicación web desarrollada
con Node.js, Express y MongoDB Atlas para gestionar
productos mediante operaciones CRUD.

El sistema incorpora autenticación JWT y permite
que cada usuario administre exclusivamente los
productos asociados a su cuenta.

### 2. Requisitos funcionales

RF01. El sistema permite registrar usuarios con
nombre, correo electrónico y contraseña.

RF02. El sistema permite iniciar sesión y generar
un token JWT para el usuario autenticado.

RF03. El sistema permite cerrar sesión desde la
interfaz web.

RF04. El sistema permite registrar productos con
nombre, descripción, precio y existencias.

RF05. El sistema permite consultar los productos
pertenecientes al usuario autenticado.

RF06. El sistema permite actualizar los datos
de los productos registrados.

RF07. El sistema permite eliminar productos,
previa confirmación del usuario.

RF08. El sistema permite buscar productos por
nombre o descripción.

RF09. El sistema muestra el número total de
productos, existencias y valor del inventario.

RF10. El sistema restringe el acceso a productos
pertenecientes a otros usuarios.

### 3. Requisitos no funcionales

RNF01. La aplicación utiliza una arquitectura
cliente-servidor basada en API REST.

RNF02. Las contraseñas se almacenan mediante
hashes generados con bcryptjs.

RNF03. Las operaciones de productos requieren
un token JWT válido.

RNF04. La información se almacena en MongoDB Atlas.

RNF05. La interfaz utiliza HTML5, CSS3 y
JavaScript, con diseño adaptable a dispositivos
móviles y computadoras.

RNF06. El proyecto utiliza variables de entorno
para administrar datos de configuración sensibles.

RNF07. El sistema incorpora pruebas automatizadas
con Jest y Supertest.

RNF08. GitHub Actions ejecuta automáticamente
las pruebas al recibir cambios en la rama
correspondiente a la Actividad 4.

RNF09. La aplicación se despliega mediante
un servicio web de Render.

RNF10. La solución mantiene separación de
responsabilidades mediante modelos, rutas,
controladores y middleware.

### 4. Justificación tecnológica

Node.js permite ejecutar JavaScript en el servidor
y facilita compartir el mismo lenguaje entre
frontend y backend.

Express simplifica la construcción de rutas REST
y la integración del middleware de autenticación.

MongoDB Atlas proporciona almacenamiento NoSQL
administrado en la nube. Mongoose permite definir
esquemas, validar información y consultar documentos.

JWT permite verificar la identidad del usuario en
las solicitudes a rutas protegidas.

Jest y Supertest permiten comprobar automáticamente
el comportamiento de la API sin modificar la base
de datos real, mediante simulaciones de los modelos.

### 5. Justificación del despliegue en Render

Se seleccionó Render porque permite publicar
aplicaciones Node.js conectadas con repositorios
GitHub y configurar variables de entorno desde
su panel de administración.

Esta alternativa facilita demostrar el funcionamiento
de la aplicación desde Internet sin administrar
directamente un servidor físico.

El proyecto utiliza MongoDB Atlas como base de
datos administrada y Render como plataforma de
ejecución del backend y distribución del frontend.

### 6. Integración y despliegue continuos

GitHub Actions ejecuta la batería de 15 pruebas
automatizadas del proyecto.

La aplicación fue publicada en Render desde la
rama actividad-4-productos-mongodb.

Se configuró Render para esperar las comprobaciones
de integración continua antes de iniciar nuevos
despliegues automáticos.

### 7. Pruebas realizadas

Se realizaron pruebas manuales de registro,
inicio de sesión, creación, consulta, actualización
y eliminación de productos.

También se comprobó que un usuario autenticado
no puede consultar ni eliminar productos que
pertenecen a otra cuenta.

Adicionalmente, se ejecutaron 15 pruebas
automatizadas con Jest y Supertest:

- 9 pruebas de productos.
- 6 pruebas de autenticación.

Todas finalizaron satisfactoriamente.

### 8. Conclusiones

TaskFlow Inventario demuestra la integración
de frontend, backend, autenticación y persistencia
NoSQL en una aplicación web funcional.

La separación del código en modelos, rutas,
controladores y middleware facilita su mantenimiento.

Las pruebas automatizadas y la publicación en
la nube permiten comprobar su funcionamiento
y respaldar la calidad del proyecto académico.
