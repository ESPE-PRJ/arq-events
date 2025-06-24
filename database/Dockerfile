# Usa la imagen oficial de PostgreSQL
FROM postgres:16

# Configura la zona horaria para Quito
ENV TZ=America/Guayaquil

# Copia el script de inicialización al directorio que PostgreSQL escanea automáticamente
COPY ./init.sql ./docker-entrypoint-initdb.d/
