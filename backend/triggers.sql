-- Trigger para actualizar el stock del producto en detalle_venta
create or replace trigger trg_update_stock_after_venta after
   insert on detalle_venta
   for each row
begin
   -- Actualizar el stock del producto después de insertar en detalle_venta
   update producto
      set
      stock = stock - :new.cantidad
    where id_producto = :new.id_producto;
end;
/

-- Trigger para calcular el subtotal en detalle_venta
create or replace trigger trg_calcular_subtotal_detalle_venta before
   insert on detalle_venta
   for each row
declare
   v_precio producto.precio%type;
begin
   -- Obtener el precio del producto relacionado
   select precio
     into v_precio
     from producto
    where id_producto = :new.id_producto;

    -- Calcular el subtotal
   :new.subtotal := :new.cantidad * v_precio;
end;
/

-- Trigger para calcular el total del comprobante
create or replace trigger trg_calcular_total_comprobante before
   insert on comprobante
   for each row
declare
   v_total number;
begin
    -- Obtener
   select sum(subtotal)
     into v_total
     from detalle_venta
    where id_venta = (
      select id_venta
        from venta
       where id_venta = :new.id_venta
   );
                        
    -- Asignar el total al comprobante
   :new.total := v_total;
end;