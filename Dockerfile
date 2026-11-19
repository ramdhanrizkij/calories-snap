# ==========================================
# Stage 1: Build the Ionic PWA
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Salin file definisi dependency
COPY package*.json ./

# Install dependensi (menggunakan npm ci untuk build yang bersih & konsisten)
RUN npm ci

# Salin seluruh source code proyek
COPY . .

# Build assets produksi (output default Vite ada di folder /app/dist)
RUN npm run build

# ==========================================
# Stage 2: Serve dengan Nginx Alpine
# ==========================================
FROM nginx:alpine AS runner

# Hapus halaman default nginx
RUN rm -rf /usr/share/nginx/html/*

# Salin konfigurasi kustom Nginx (SPA routing + PWA cache settings)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil build dari stage builder ke folder web root Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port HTTP
EXPOSE 80

# Jalankan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
