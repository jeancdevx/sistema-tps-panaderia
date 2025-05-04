# Sistema de Gestión para Panadería

Este repositorio contiene el desarrollo de un sistema empresarial para la gestión de ventas, inventario y proveedores de una panadería. El proyecto está estructurado en carpetas que separan la lógica de backend, frontend, requisitos, historias de usuario y diagramas.

## Índice

1. [backend/](#backend)
    - [create/](#create)
    - [delete/](#delete)
    - [insert/](#insert)
    - [oracle-database/](#oracle-database)
    - [read/](#read)
2. [frontend/](#frontend)
3. [diagramas/](#diagramas)
4. [historias/](#historias)
5. [requisitos/](#requisitos)
6. [README.md](#readmemd)

---

## backend/

Contiene todos los scripts SQL necesarios para la gestión de la base de datos Oracle del sistema.

- **sys.sql**  
  Script para la creación y configuración del usuario de base de datos.

- **triggers.sql**  
  Incluye triggers para automatizar procesos como actualización de stock, cálculo de subtotales y totales en ventas y comprobantes.

### create/

- **schema.sql**  
  Script para la creación de todas las tablas principales del sistema: categorías, empleados, clientes, proveedores, productos, ventas, detalle de venta, comprobantes, boletas y facturas.

### delete/

- **drop-tables.sql**  
  Script para eliminar todas las tablas de la base de datos, útil para reiniciar el esquema.

### insert/

Scripts para poblar las tablas con datos iniciales:
- **categorias.sql**: Inserta categorías de productos.
- **cliente.sql**: Inserta clientes.
- **detalle_venta.sql**: Inserta detalles de ventas.
- **empleado.sql**: Inserta empleados.
- **ingrediente_producto.sql**: Inserta relaciones entre ingredientes y productos.
- **ingrediente.sql**: Inserta ingredientes.
- **producto.sql**: Inserta productos.
- ...otros scripts de inserción.

### oracle-database/

Scripts y utilidades adicionales para la administración de la base de datos Oracle.

#### read/

Scripts para consultas y reportes sobre la base de datos.

---

## frontend/

Carpeta destinada al desarrollo del frontend del sistema (actualmente vacía o en desarrollo).

---

## diagramas/

Contiene diagramas visuales del sistema:

- **Proceso de Ventas.png**: Diagrama del flujo de ventas.
- **Sistemas Empresariales - ER - Jeancarlo Morales.drawio.png**: Diagrama entidad-relación editable.
- **Sistemas Empresariales - ER - Jeancarlo Morales.png**: Diagrama entidad-relación en formato imagen.

---

## historias/

Incluye la documentación de historias de usuario y épicas:

- **epicas.txt**: Historias épicas que describen los objetivos generales del sistema.
- **usuario.txt**: Historias de usuario detalladas que describen las necesidades y funcionalidades desde la perspectiva de los usuarios.

---

## requisitos/

Contiene los requisitos del sistema:

- **funcionales.txt**: Requisitos funcionales que describen las funcionalidades que debe cumplir el sistema.
- **no_funcionales.txt**: Requisitos no funcionales que especifican restricciones y características de calidad del sistema.

---