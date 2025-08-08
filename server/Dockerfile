# Production-ready Dockerfile for the backend API
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install OS deps if needed (openssl for Prisma)
RUN apk add --no-cache openssl

# Copy package files first for better caching
COPY package*.json ./

# Install only prod deps; prisma is a dev dep but needed for generate
RUN npm ci --omit=dev && npm install prisma --no-save

# Copy source
COPY . .

## Build application
# Generate Prisma client and compile TypeScript
RUN npx prisma generate && npm run build

# Expose port and start
EXPOSE 4000
CMD ["node", "src/index.js"]
