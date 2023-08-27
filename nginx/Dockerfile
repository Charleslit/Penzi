# Use an official Nginx runtime as the base image
FROM nginx:latest

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# SSL certificate and key files will be mounted as volumes
COPY /etc/letsencrypt/live/charleslit.uk.to/fullchain.pem /etc/nginx/ssl/
COPY /etc/letsencrypt/live/charleslit.uk.to/privkey.pem /etc/nginx/ssl/
COPY /etc/letsencrypt/live/penzi.chickenkiller.com/fullchain.pem /etc/nginx/ssl/
COPY /etc/letsencrypt/live/penzi.chickenkiller.com/privkey.pem /etc/nginx/ssl/
