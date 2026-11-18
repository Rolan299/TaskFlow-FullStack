
# Diagrama entidad-relación — TaskFlow Inventario

```mermaid
erDiagram
    USUARIO ||--o{ PRODUCTO : administra

    USUARIO {
        ObjectId _id PK
        string nombre
        string correo UK
        string passwordHash
        date createdAt
        date updatedAt
    }

    PRODUCTO {
        ObjectId _id PK
        string nombre
        string descripcion
        number precio
        number stock
        ObjectId usuario FK
        date createdAt
        date updatedAt
    }
```

## Descripción de la relación

Un usuario puede registrar cero o muchos productos.

Cada producto pertenece a un único usuario.

El campo `usuario` del modelo Producto almacena
el ObjectId del usuario propietario.

La aplicación utiliza esa referencia para restringir
la consulta, actualización y eliminación de productos.
