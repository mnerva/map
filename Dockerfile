# === Build backend ===
FROM node:20 AS backend-build
WORKDIR /app/server
COPY ./server/package.json ./ 
RUN npm install
COPY ./server ./

RUN echo "Checking contents of log_handling..." && ls -la /app/server/log_handling

# Make sure the script is executable
RUN chmod +x /app/server/log_handling/handleLogs.sh

# === Build final image ===
FROM nginx:alpine

# Serve static frontend files
COPY ./public /usr/share/nginx/html

# Copy backend app
COPY --from=backend-build /app/server /server

# Copy nginx config
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Install Node.js + npm so backend can run
RUN apk add --no-cache nodejs npm bash

# Install Node so backend can run
RUN apk add --no-cache nodejs npm

# Set backend working dir
WORKDIR /server

# Expose port
EXPOSE 80

# Start both backend and nginx
CMD sh -c "node server.js & nginx -g 'daemon off;'"
