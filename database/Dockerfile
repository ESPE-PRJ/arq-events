# Usa la imagen oficial de PostgreSQL
FROM postgres:16

# Copia el script de inicialización al directorio que PostgreSQL escanea automáticamente
COPY ./init.sql ./docker-entrypoint-initdb.d/
