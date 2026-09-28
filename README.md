# 270_WeatherApi - Praktikum Pengembangan Web Service
**Praktikum 3: Integrasi API MapTiler & Weather API**

### Identitas Mahasiswa
- **Nama:** Al-Bukhari Insan Kamil
- **NIM:** 20240140270
- **Mata Kuliah:** Pengembangan Web Service

---

## Deskripsi Proyek
Aplikasi web berbasis Node.js & Express untuk mengambil dan menampilkan data geocoding (negara, provinsi, kecamatan, koordinat) menggunakan API MapTiler serta data cuaca/suhu secara real-time.

## Fitur Utama
- **Input Pencarian Lokasi Dinamis**: Pengguna dapat mencari cuaca berdasarkan nama kota, kecamatan, atau daerah.
- **Deteksi GPS Otomatis (Geolocation)**: Tombol *Lokasi Saya* untuk mendeteksi koordinat perangkat secara langsung dan melakukan *reverse geocoding*.
- **Informasi Wilayah Lengkap**: Menampilkan Negara, Provinsi, serta Kecamatan / Kabupaten.
- **Informasi Cuaca Real-Time**: Suhu (°C), kondisi cuaca, kelembaban udara, dan kecepatan angin.
- **Koordinat Geografis**: Longitude & Latitude presisi tinggi.
- **Peta Interaktif (Leaflet.js)**: Navigasi visual otomatis (*fly-to*) dengan pin marker dan popup info cuaca.

---

## Endpoint API

| Method | Endpoint | Query Parameter | Deskripsi |
|---|---|---|---|
| `GET` | `/api/lokasi` | `kota={nama_lokasi}` | Mengambil data geocoding dan cuaca berdasarkan nama wilayah |
| `GET` | `/api/lokasi` | `lat={latitude}&lon={longitude}` | Mengambil data cuaca dan reverse geocoding berdasarkan koordinat GPS |
| `GET` | `/api/cuaca` | `kota={nama_lokasi}` | Alias endpoint untuk `/api/lokasi` |

---

## Bukti Hasil GET Data (Screenshot)
Berikut adalah bukti pengujian pengambilan data melalui API:

![](screenshots/1.png)
![](screenshots/2.png)
![](screenshots/3.png)

---

## Teknologi yang Digunakan
- **Backend:** Node.js, Express.js, Axios, CORS
- **Frontend:** HTML5, CSS3 (Glassmorphism), JavaScript (ES6+), Leaflet.js
- **Eksternal API:**
  - MapTiler Geocoding API (Pencarian & Reverse Geocoding Wilayah)
  - Open-Meteo Weather API (Data Suhu dan Cuaca Real-Time)

---

## Cara Menjalankan Proyek
1. Clone repositori:
   ```bash
   git clone https://github.com/albukhari21/270_WeatherApi.git
   cd 270_WeatherApi
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan server:
   ```bash
   npm start
   ```
4. Buka di browser:
   ```text
   http://localhost:3000
   ```
