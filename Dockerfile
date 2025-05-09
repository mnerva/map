FROM nginx:alpine

# Remove the default index.html
RUN rm -rf /usr/share/nginx/html/*

# Copy static files to the Nginx HTML folder
COPY ./public /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80
