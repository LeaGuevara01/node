# Multi-service workspace: server (API) and client (static)
# This top-level Dockerfile builds both, but Render Blueprint will typically build each service separately.

# Build frontend
FROM node:20-alpine AS frontend
WORKDIR /client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Build backend
FROM node:20-alpine AS backend
WORKDIR /server
ENV NODE_ENV=production
RUN apk add --no-cache openssl
COPY server/package*.json ./
RUN npm ci --omit=dev && npm install prisma --no-save
COPY server/ .
RUN npx prisma generate

# Final image serving API and static (optional nginx could be used). Here we only keep API; static is for a static host.
FROM node:20-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
COPY --from=backend /server /app
# Frontend build is exported separately in /client/dist if needed by a static server
EXPOSE 4000
CMD ["node", "src/index.js"]
