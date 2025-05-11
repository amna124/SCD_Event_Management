# ---------- FRONTEND BUILD STAGE ----------
FROM node:18 AS frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build


# ---------- BACKEND + FINAL IMAGE ----------
FROM node:18

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend and built frontend
COPY backend/ ./backend/
COPY backend/.env ./backend/
COPY --from=frontend /app/frontend/build ./backend/public

EXPOSE 5000

CMD ["node", "backend/server.js"]
