# ---------- FRONTEND BUILD STAGE ----------
FROM node:18 AS frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build


# ---------- BACKEND + FINAL IMAGE ----------
# ---------- FINAL IMAGE STAGE (Backend) ----------
FROM node:18 AS final

WORKDIR /app

# Install backend dependencies with increased timeouts and explicit registry
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm install

# Copy the rest of the backend code
WORKDIR /app
COPY backend/ ./backend/

# Copy built frontend from the build stage
COPY --from=frontend /app/frontend/build ./backend/public

EXPOSE 5000
CMD ["node", "backend/server.js"]

