FROM mysql:latest

# Copy the custom entrypoint script into the container
COPY ./sql.sql /docker-entrypoint-initdb.d/
COPY entrypoint.sh /docker-entrypoint-initdb.d/

# Make the entrypoint script executable
RUN chmod +x /docker-entrypoint-initdb.d/entrypoint.sh
