# Use an official Nginx runtime as the base image
FROM nginx:latest

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a directory to store SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Copy the SSL certificate and key files to the appropriate directory
RUN cp /etc/letsencrypt/live/charleslit.uk.to/fullchain.pem /etc/nginx/ssl/charleslit.uk.to.crt \
    && cp /etc/letsencrypt/live/charleslit.uk.to/privkey.pem /etc/nginx/ssl/charleslit.uk.to.key \
    && cp /etc/letsencrypt/live/penzi.chickenkiller.com/fullchain.pem /etc/nginx/ssl/penzi.chickenkiller.com.crt \
    && cp /etc/letsencrypt/live/penzi.chickenkiller.com/privkey.pem /etc/nginx/ssl/penzi.chickenkiller.com.key

# Expose ports
EXPOSE 80
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]