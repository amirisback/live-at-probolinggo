# Live At Probolinggo 🏙️

Portal layanan warga Probolinggo. Temukan penyedia jasa terpercaya langsung dari tetangga sendiri, mulai dari tukang bangunan, teknisi, pembersih rumah, hingga berbagai keahlian lainnya. Platform 100% gratis untuk memajukan perekonomian lokal kota Probolinggo.

![Cover](public/images/testimonials/placeholder.png)

## 🌟 Fitur Utama
- **Direktori Jasa Lokal**: Cari dan temukan berbagai penyedia jasa lokal berbasis kategori.
- **Formulir Pendaftaran Jasa (Self-Service)**: Warga dapat mendaftarkan keahlian mereka agar mudah ditemukan. Tersedia fitur terintegrasi koordinat GPS (*Geolocation Google Maps*).
- **Testimoni**: Tinggalkan jejak dan ulasan positif setelah menggunakan layanan warga lain agar penyedia jasa semakin tepercaya.
- **Admin Dashboard CMS (JSON Base)**: Dasbor manajemen web serba instan tanpa ketergantungan *database* eksternal. Admin bisa mengubah Data Layanan, Info Website, dan UI Footer dengan mengubah format JSON lewat GUI.
- **Fitur Upload CSV**: Tambahkan puluhan data kontak pendaftaran layanan secara massal langsung via unggahan CSV di antarmuka Admin.
- **Git Auto Commit & Push**: Pendaftaran dari formulir warga otomatis disimpan dan dikomit (*Node.js child_process*) secara *real-time* ke repositori pada server *Production*.
- **PWA Ready**: Web ini bisa di-instal langsung menjadi aplikasi di *Home Screen* HP layaknya aplikasi *native* karena sudah didukung standar Progressive Web App (PWA).

## 🚀 Teknologi yang Digunakan
- **Next.js 16 (App Router)** - Framework *frontend* modern dan reaktif.
- **Tailwind CSS v4** - *Styling* khusus dengan modifikasi tema *Glassmorphism*.
- **Next-PWA (Serwist)** - Menangani registrasi *Service Worker* & *Cache Offline*.
- **Node.js `fs` module** - *Source of Truth* penyimpanan data melalui struktur JSON sederhana.
- **Emoji Picker React** - Untuk melengkapi kustomisasi pembuatan kategori jasa baru.

## 🛠️ Cara Menjalankan Secara Lokal

1. **Clone repository ini**
   ```bash
   git clone https://github.com/amirisback/live-at-probolinggo.git
   cd live-at-probolinggo
   ```

2. **Install Dependensi NPM**
   ```bash
   npm install
   ```

3. **Jalankan Server Development**
   ```bash
   npm run dev
   ```

4. **Buka Browser** 
   Arahkan tautan Anda ke: [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Data Pusat (CMS)
Data web ini murni dikelola melalui direktori `/data/` untuk menjamin performa mutlak (0 ms query database):
- `data/services.json` = Sentral data Layanan & Kontak penyedia jasa.
- `data/testimonials.json` = Sentral data *Review* dan ulasan.
- `data/footer.json`, `data/site.json`, `data/cta.json` = Konfigurasi teks statis pada *Landing Page*.

Anda (selaku pihak *Admin*) dapat mengubah isian-isian ini secara grafis tanpa menyentuh *code* via rute **[http://localhost:3000/admin](http://localhost:3000/admin)**.

---
> *Dibuat dengan ❤️ di Probolinggo. Dari Warga Untuk Warga.*


## Colaborator
Very open to anyone, I'll write your name under this, please contribute by sending an email to me

- Mail To faisalamircs@gmail.com
- Subject : Github _ [Github-Username-Account] _ [Language] _ [Repository-Name]
- Example : Github_amirisback_kotlin_admob-helper-implementation

Name Of Contribute
- Muhammad Faisal Amir
- Donny Sabri Ashari
- Waiting List

Waiting for your contribute

## Attention !!!
- Please enjoy and don't forget fork and give a star
- Don't Forget Follow My Github Account