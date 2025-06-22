alter session set "_ORACLE_SCRIPT" = true;

-- Crear usuario para la panadería
create user panaderiadb identified by 1234;
-- Asignar todos los permisos al usuario
grant all privileges to panaderiadb;
alter user panaderiadb
   quota unlimited on users;

drop user panaderiadb cascade;