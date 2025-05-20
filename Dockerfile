# === Build frontend ===
FROM node:20 AS frontend-build
WORKDIR /app/public
COPY ./public ./
RUN npm install && npm run build

# === Build backend ===
FROM node:20 AS backend-build
WORKDIR /app/server
COPY ./server/package*.json ./
RUN npm install
COPY ./server ./

# === Build final image ===
FROM nginx:alpine

# Copy frontend build into Nginx's HTML dir
COPY --from=frontend-build /app/public /usr/share/nginx/html

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
