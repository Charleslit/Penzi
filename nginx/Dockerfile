# Use an official Nginx runtime as the base image
FROM nginx:latest

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificate and key files
COPY /etc/letsencrypt/live/charleslit.uk.to/fullchain.pem /etc/nginx/ssl/
COPY /etc/letsencrypt/live/charleslit.uk.to/privkey.pem /etc/nginx/ssl/
