# Use an official Nginx runtime as the base image
FROM nginx:latest

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a directory to store SSL certificates
RUN mkdir -p /etc/nginx/ssl
COPY  nginx.conf  /etc/nginx/conf.d/default.conf