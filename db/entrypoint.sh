#!/bin/bash
MYSQL_ROOT_PASSWORD=$(grep 'password' /config.ini | cut -d '=' -f 2)
# Read MySQL credentials from config.ini
MYSQL_USER=$(grep 'username' /config.ini | cut -d '=' -f 2)
MYSQL_PASSWORD=$(grep 'password' /config.ini | cut -d '=' -f 2)
MYSQL_DATABASE=$(grep 'database' /config.ini | cut -d '=' -f 2)
MYSQL_ROOT_PASSWORD=$(grep 'password' /config.ini | cut -d '=' -f 2) # Use the same password as the user password

# Set MySQL environment variables
export MYSQL_USER
export MYSQL_PASSWORD
export MYSQL_DATABASE
export MYSQL_ROOT_PASSWORD

# Call the original MySQL entrypoint script
/docker-entrypoint.sh "$@"
