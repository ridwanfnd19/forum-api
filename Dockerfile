# Menggunakan base image Node.js
FROM node:lts-alpine3.18

# Set working directory di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json untuk menginstal dependensi
COPY package*.json ./

# Menginstal dependensi
RUN npm install

# Menyalin semua file proyek ke dalam container
COPY . .

# Menambahkan tabel ke database
RUN npm run migrate up

# Expose port
EXPOSE 5000

# Menjalankan perintah untuk memulai aplikasi
CMD [ "npm", "run", "start" ]
