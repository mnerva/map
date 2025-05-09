# Use the official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy remaining app files
COPY . .

# Expose port (match the one in your server.js)
EXPOSE 8000

# Run the app
CMD ["npm", "start"]
