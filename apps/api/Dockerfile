# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY prisma/package*.json ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/api/ ./apps/api/
COPY prisma/ ./prisma/

# Build the application
WORKDIR /app/apps/api
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8080

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"] 