-- Trigger para actualizar el stock del producto en detalle_venta
create or replace trigger trg_update_stock_after_venta after
   insert on detalle_venta
   for each row
begin
   update producto
      set
      stock = stock - :new.cantidad
    where id = :new.id;
end;
/

-- Trigger para calcular el subtotal en detalle_venta
create or replace trigger trg_calcular_subtotal_detalle_venta before
   insert on detalle_venta
   for each row
declare
   v_precio producto.precio%type;
begin
   select precio
     into v_precio
     from producto
    where id = :new.id;

    -- Calcular el subtotal
   :new.subtotal := :new.cantidad * v_precio;
end;
/