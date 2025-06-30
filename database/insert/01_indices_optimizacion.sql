-- Índices para mejorar rendimiento en JOINs
CREATE INDEX idx_producto_categoria ON producto(id_categoria);
CREATE INDEX idx_cliente_tipo ON cliente(id_tipo_cliente);
CREATE INDEX idx_empleado_cargo ON empleado(id_cargo);
CREATE INDEX idx_pedido_cliente ON pedido(id_cliente);
CREATE INDEX idx_pedido_empleado ON pedido(id_empleado);
CREATE INDEX idx_pedido_tipo_pago ON pedido(id_tipo_pago);
CREATE INDEX idx_detalle_pedido ON detalle_venta(id_pedido);
CREATE INDEX idx_detalle_producto ON detalle_venta(id_producto);
CREATE INDEX idx_boleta_pedido ON boleta(id_pedido);
CREATE INDEX idx_factura_pedido ON factura(id_pedido);

-- Índices para consultas frecuentes
CREATE INDEX idx_cliente_email ON cliente(email);
CREATE INDEX idx_empleado_dni ON empleado(dni);
CREATE INDEX idx_pedido_fecha ON pedido(fecha);
CREATE INDEX idx_producto_nombre ON producto(nombre);
CREATE INDEX idx_cliente_nombre_apellido ON cliente(nombre, apellido);
CREATE INDEX idx_pedido_estado ON pedido(estado);

-- Índice para consultas de ventas por periodo y empleado
CREATE INDEX idx_pedido_fecha_empleado ON pedido(fecha, id_empleado);

-- Índice para consultas de productos por categoría y stock
CREATE INDEX idx_producto_categoria_stock ON producto(id_categoria, stock);

-- Índice para consultas de detalles por pedido y producto
CREATE INDEX idx_detalle_pedido_producto ON detalle_venta(id_pedido, id_producto);

-- eliminar indices
DROP INDEX idx_producto_categoria;
DROP INDEX idx_cliente_tipo;
DROP INDEX idx_empleado_cargo;
DROP INDEX idx_pedido_cliente;
DROP INDEX idx_pedido_empleado;
DROP INDEX idx_pedido_tipo_pago;
DROP INDEX idx_detalle_pedido;
DROP INDEX idx_detalle_producto;
DROP INDEX idx_boleta_pedido;
DROP INDEX idx_factura_pedido;
DROP INDEX idx_cliente_email;
DROP INDEX idx_empleado_dni;
DROP INDEX idx_pedido_fecha;
DROP INDEX idx_producto_nombre;
DROP INDEX idx_cliente_nombre_apellido;
DROP INDEX idx_pedido_estado;
DROP INDEX idx_pedido_fecha_empleado;
DROP INDEX idx_producto_categoria_stock;
DROP INDEX idx_detalle_pedido_producto;