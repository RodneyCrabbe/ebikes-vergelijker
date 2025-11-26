# Use Node.js 22 as base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5195

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5195"]
