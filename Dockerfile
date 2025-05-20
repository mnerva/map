# === Build backend ===
FROM node:20 AS backend-build
WORKDIR /app
COPY ./server ./server
WORKDIR /app/server
RUN npm install

# === Build final image ===
FROM nginx:alpine

# Serve static frontend files
COPY ./public /usr/share/nginx/html

# Copy backend app
COPY --from=backend-build /app/server /server

# Copy nginx config
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Install Node so backend can run
RUN apk add --no-cache nodejs npm

# Set backend working dir
WORKDIR /server

# RUN npm install

EXPOSE 80

# Start both backend and nginx
CMD sh -c "node server.js & nginx -g 'daemon off;'"
