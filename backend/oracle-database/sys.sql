-- Active: 1745851414825@@127.0.0.1@1521@XE@PANADERIADB
ALTER SESSION SET "_ORACLE_SCRIPT" = TRUE;

-- Crear usuario para la panadería
CREATE USER panaderiadb IDENTIFIED BY 1234
DEFAULT TABLESPACE USERS
TEMPORARY TABLESPACE TEMP
QUOTA UNLIMITED ON USERS;

-- Otorgar los privilegios necesarios
GRANT CREATE SESSION TO panaderiadb;
GRANT CREATE TABLE TO panaderiadb;
GRANT CREATE SEQUENCE TO panaderiadb;
GRANT CREATE PROCEDURE TO panaderiadb;
GRANT CREATE TRIGGER TO panaderiadb;
GRANT CREATE VIEW TO panaderiadb;
GRANT CREATE SYNONYM TO panaderiadb;

-- Otorgar roles básicos para desarrollo
GRANT CONNECT, RESOURCE TO panaderiadb;

-- eliminar el usuario panaderiadb y todas sus dependencias
DROP USER panaderiadb CASCADE;

-- mostrar todos los usuarios de la base de datos
SELECT username FROM all_users;