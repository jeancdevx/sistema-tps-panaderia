insert into producto (
   nombre,
   precio,
   stock,
   id_categoria
) values ( 'Pan de Molde',
           3.50,
           100,
           1 );

insert into producto (
   nombre,
   precio,
   stock,
   fecha_vencimiento,
   id_categoria,
   id_proveedor
) values ( 'Torta de Chocolate',
           25.00,
           50,
           to_date('2024-11-30','YYYY-MM-DD'),
           2,
           2 );

insert into producto (
   nombre,
   precio,
   stock,
   fecha_vencimiento,
   id_categoria,
   id_proveedor
) values ( 'Sprite',
           2.5,
           15,
           to_date('2024-09-30','YYYY-MM-DD'),
           3,
           1 );

insert into producto (
   nombre,
   precio,
   stock,
   fecha_vencimiento,
   id_categoria,
   id_proveedor
) values ( 'Galletas de Mantequilla',
           5.00,
           35,
           to_date('2024-10-15','YYYY-MM-DD'),
           4,
           3 );