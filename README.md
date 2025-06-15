# **PelukDiri: Platform Dukungan Kesehatan Mental dan Teman Virtual**

## **Informasi Peserta**

| No | Nama                            | Email Dicoding                                              |
| -- | ------------------------------- | ----------------------------------------------------------- |
| 1  | Bagus Angkasawan Sumantri Putra | [bagusasp01@gmail.com](mailto:bagusasp01@gmail.com)         |
| 2  | Ryan Nugroho                    | [ryanayr2112@gmail.com](mailto:ryanayr2112@gmail.com)       |
| 3  | Silvi Kusuma Wardhani Gunawan   | [silvikusuma043@gmail.com](mailto:silvikusuma043@gmail.com) |

## **Tema**

**Kesehatan Mental dan Dampak Judi Online**

## **Latar Belakang Masalah**

Berdasarkan data dari GoodStats (2024), angka kasus bunuh diri di Indonesia meningkat 60% dalam lima tahun terakhir. Ini menunjukkan krisis kesehatan mental yang makin serius, diperparah oleh lonjakan kasus judi online yang menimbulkan dampak sosial, ekonomi, dan psikologis tidak hanya bagi pelaku, tetapi juga keluarga dan masyarakat (Indonesia.go.id, 2024; Concept, 2023).

Rendahnya literasi kesehatan mental dan stigma sosial menyebabkan keterlambatan deteksi dini dan penanganan. Minimnya pemantauan dari orang terdekat menyebabkan penderita merasa terisolasi dan enggan mencari bantuan profesional (BCSPS, 2022; Media Indonesia, 2024; CPMH UGM, 2020). Solusi teknologi dibutuhkan untuk menjangkau, mengedukasi, dan mendampingi masyarakat secara luas dan berkelanjutan.

## **Deskripsi Produk/Aplikasi**

**PelukDiri** adalah aplikasi web yang berfungsi sebagai platform dukungan kesehatan mental dan teman virtual. Fungsinya meliputi:

* Edukasi kesehatan mental
* Pencegahan dan penanganan dini dampak judi online
* Check-in emosional harian
* Interaksi dukungan kelompok (Group Support)
* Chatbot dukungan awal

Aplikasi ini bersifat anonim, aman, dan membangun komunitas suportif.

## **Fitur Utama dan Teknologi yang Digunakan**

### **1. Artikel/Blog**

* **Deskripsi**: Konten edukatif kesehatan mental & dampak judi online.
* **Teknologi**: `React.js`, `Vite`.

### **2. Daily Check-In**

* **Deskripsi**: Tracking suasana hati & rekomendasi aktivitas dari Azure OpenAI.
* **Teknologi**: `React.js`, `Vite`, `Express.js`, `MongoDB`, `Azure OpenAI Service`.

### **3. Group Support**

* **Deskripsi**: Dukungan dari orang terdekat dengan notifikasi kondisi buruk.
* **Teknologi**: `React.js`, `TailwindCSS`, `Express.js`, `MongoDB`, `WebSockets`.

### **4. Chatbot**

* **Deskripsi**: Menjawab pertanyaan dan memberikan dukungan awal.
* **Teknologi**: `Python Flask`, `Vertex AI Gemini`, `JavaScript`.

### **5. Antarmuka Ramah Pengguna**

* **Desain**: Bersih, intuitif, mudah dinavigasi.
* **Teknologi**: `React.js`, `TailwindCSS`.

### **6. Responsif**

* **Deskripsi**: Kompatibel di desktop, tablet, dan mobile.
* **Teknologi**: `TailwindCSS`.

### **7. Deployment**

* **Frontend**: `Vercel`
* **Backend**: `Azure Container App`, `Azure App Service`

## **Cara Penggunaan Produk**

### **Akses Awal**

* Buka: [https://pelukdiri.vercel.app/](https://pelukdiri.vercel.app/)

### **Menggunakan Chatbot**

1. Klik ikon **Chatbot**
2. Ketik perasaan atau pertanyaan
3. Chatbot merespons secara interaktif (Flask + Vertex AI Gemini)

### **Membaca Artikel Blog**

1. Masuk ke menu **Blog**
2. Gunakan filter kategori (misal: *Judi Online*)
3. Klik **Baca Selengkapnya**

### **Melakukan Daily Check-In**

1. Masuk ke menu **Check-in**
2. **Login/Registrasi**

   * *Username*: `testing`
   * *Password*: `testing12345`
3. Pilih mood & deskripsi
4. Dapatkan rekomendasi aktivitas
5. Lihat riwayat & ubah profil

### **Menggunakan Group Support**

1. Masuk ke menu **Group Support**
2. Buat grup baru atau gabung grup
3. Kirim pesan real-time
4. Notifikasi otomatis jika mood “buruk” atau keyword “judi” terdeteksi
5. Kreator grup dapat mengatur/menghapus grup

## **Informasi Pendukung**

### **Rancang Bangun Teknologi**

| Komponen             | Teknologi                                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**         | React.js + Vite (Vercel)                                                                                                                                           |
| **Chatbot**          | Python Flask (Azure Container App), Vertex AI Gemini                                                                                                               |
| **Backend**          | Express.js (Azure App Service)                                                                                                                                     |
| **Database**         | MongoDB                                                                                                                                                            |
| **Rekomendasi AI**   | Azure OpenAI Service                                                                                                                                               |
| **Group Chat**       | WebSockets                                                                                                                                                         |
| **API Docs Backend** | [https://mentalmate-backend.azurewebsites.net/api/docs](https://mentalmate-backend.azurewebsites.net/api/docs)                                                     |
| **API Docs Chatbot** | [https://mentalmate-app.yellowsky-7db257e3.eastus.azurecontainerapps.io/api/docs](https://mentalmate-app.yellowsky-7db257e3.eastus.azurecontainerapps.io/api/docs) |

## **Tautan Proyek**

* **GitHub**: [ryanjiroo/pelukdiri](https://github.com/ryanjiroo/pelukdiri)
* **Demo Video**: [Google Drive](https://drive.google.com/drive/folders/1HI0xnGs6qW3hqhY1rJlLsFueoBFoySYE)

## **Audiens Sasaran**

* Individu yang ingin mengakses bantuan kesehatan mental secara rahasia
* Masyarakat terdampak judi online
* Komunitas yang ingin melacak kesejahteraan emosional mereka

## **Visi Pengembangan Mendatang**

* Integrasi layanan psikolog profesional
* Notifikasi check-in yang dapat dikustomisasi
* Konten multimedia (video, podcast)
* Fitur moderasi Group Support
* Kemitraan dengan perusahaan peduli kesehatan mental
* Komitmen terhadap *green jobs* & lingkungan kerja sehat

## **Tim Pengembang**

| No | Nama                            | Peran              |
| -- | ------------------------------- | ------------------ |
| 1  | Bagus Angkasawan Sumantri Putra | Backend Developer  |
| 2  | Ryan Nugroho                    | Frontend Developer |
| 3  | Silvi Kusuma Wardhani Gunawan   | UI/UX Designer     |
