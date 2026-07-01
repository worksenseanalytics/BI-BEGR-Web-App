# BI-BEGR Culture Dashboard - KONSOL BEGR

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=flat-square&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=flat-square&logo=googleappsscript&logoColor=white)](https://developers.google.com/apps-script)
[![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=flat-square&logo=googlesheets&logoColor=white)](https://www.google.com/sheets/about/)

Dasbor Pemantauan Budaya KONSOL BEGR Bank Indonesia merupakan platform analitis telemetri eksekutif tingkat lanjut yang dirancang khusus untuk memetakan, memantau, dan menganalisis level kematangan budaya (Culture Maturity Level - CML) di seluruh Satuan Kerja (Satker) Bank Indonesia secara terpusat, reaktif, dan real-time.

Aplikasi ini dirancang menggunakan arsitektur modern berkinerja tinggi, memanfaatkan integrasi Google Apps Script (GAS) dengan antarmuka web modern React 19, Tailwind CSS v4, dan visualisasi interaktif Recharts.

---

## Fitur Utama

1. **Overview View (Ringkasan Utama)**
   * Pemetaan level kematangan CML (Wide, KP, KPw).
   * Grafik visualisasi EVP & Pilar Kebijakan Budaya Kerja dengan batas target kelulusan.
   * Radar Chart 5 dimensi Nilai-Nilai Strategis (NNS) dan Papan Peringkat Top & Bottom Satker.
2. **Ranking View (Leaderboard Dinamis)**
   * Pemeringkatan Satker secara menyeluruh dengan fitur pencarian instan dan penyaringan berbasis kelompok budker.
3. **Satker Detail View (Analisis 360°)**
   * Deep dive profil satuan kerja yang mengintegrasikan data EVP, radar NNS, dan tingkat pemenuhan parameter Championship Program.
4. **Report View (Executive KPI Telemetry)**
   * Ringkasan KPI eksekutif menggunakan Bento Grid layout, segmented control interaktif, dan visualisasi tren program kebudayaan nasional.
5. **Settings View & Google Sheets Sync**
   * Pengaturan parameter aplikasi dan batas target acuan kelulusan yang tersinkronisasi dua arah langsung dengan Google Sheets.

---

## Arsitektur dan Teknologi

* **Frontend Framework**: React 19 & TypeScript.
* **Styling Engine**: Tailwind CSS v4.
* **Kompilasi**: Vite 6 dengan `vite-plugin-singlefile` (mengemas seluruh aplikasi ke dalam satu file HTML mandiri untuk performa optimal dan kompatibilitas GAS).
* **Manajemen State**: Context API dengan optimasi render reaktif.
* **Integrasi Data**: IndexedDB untuk caching lokal berkinerja tinggi serta sinkronisasi data asinkron berbasis kompresi Gzip.

---

## Integrasi Google Apps Script (GAS)

Dasbor ini dirancang untuk bekerja secara mulus (*native integration*) di dalam ekosistem Google Sheets menggunakan Google Apps Script. 

### Struktur Berkas Apps Script
Proyek ini menyertakan berkas skrip Apps Script berikut pada direktori utama:
1. **`Code.gs`**:
   * Menangani pemanggilan web app (`doGet`) dengan memuat berkas kompilasi `Dashboard-for-Spreadsheet.html`.
   * Berfungsi sebagai API Server mini untuk mengambil data lembar kerja (*sheet*) melalui fungsi `getSheetDataByName` yang dilengkapi dengan kompresi data `gzip` & pengkodean `base64` untuk efisiensi transfer data berukuran besar.
2. **`setup.gs`**:
   * Membuat menu kustom di lembar kerja Google Sheets (`BI KONSOL BEGR`).
   * Menginisialisasi basis data lembar kerja `KONSOL BEGR` dengan 94 kolom standar baku, pemformatan sel, dan konfigurasi default.
   * Menginisialisasi lembar kerja `PENGATURAN UMUM` untuk mengontrol variabel global dasbor (seperti target maturity level, nama divisi pengelola, dan judul dasbor).

### Cara Integrasi ke Google Sheets
1. Lakukan kompilasi lokal menggunakan `npm run build`. Hasil build otomatis disalin ke berkas **`Dashboard-for-Spreadsheet.html`** di root folder.
2. Buka spreadsheet Google Sheets target Anda.
3. Pilih menu **Extensions** -> **Apps Script**.
4. Salin kode dari berkas `Code.gs` dan `setup.gs` ke editor Apps Script Anda.
5. Buat file baru berjenis HTML di editor Apps Script dengan nama **`Dashboard-for-Spreadsheet.html`**, lalu salin seluruh isi berkas `Dashboard-for-Spreadsheet.html` hasil build lokal Anda ke dalamnya.
6. Klik **Deploy** -> **New Deployment** -> Pilih jenis **Web App** -> Jalankan deployment.
7. Buka kembali Google Sheets Anda, jalankan menu **BI KONSOL BEGR** -> **Inisialisasi Database KONSOL BEGR** untuk memformat struktur pangkalan data secara otomatis.

---

## Jalankan Secara Lokal

### Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi 20 atau lebih baru direkomendasikan).

### Langkah-langkah
1. **Unduh Dependensi**:
   * Karena beberapa pustaka pihak ketiga memiliki alur penginstalan intensif memori pada sistem operasi tertentu, disarankan menggunakan bendera `--ignore-scripts`:
     ```bash
     npm install --ignore-scripts
     ```
2. **Konfigurasi Lingkungan**:
   * Salin `.env.example` menjadi `.env.local`
   * Masukkan kunci API Gemini Anda pada variabel `GEMINI_API_KEY`:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
3. **Jalankan Server Dev**:
   ```bash
   npm run dev
   ```
   * Dasbor lokal Anda akan dapat diakses pada alamat: `http://localhost:3000`.

---

## Penyebaran Otomatis (GitHub Pages)

Dasbor ini telah dikonfigurasi untuk terintegrasi dengan **GitHub Actions** untuk penyebaran otomatis tanpa hambatan (zero-friction deployment).

### Konfigurasi Awal di GitHub
1. Pastikan berkas alur kerja di `.github/workflows/deploy.yml` sudah didorong (push) ke repositori GitHub Anda.
2. Buka halaman repositori Anda di GitHub, pilih menu **Settings** -> **Pages**.
3. Di bawah bagian **Build and deployment** -> **Source**, ubah opsi dari *Deploy from a branch* menjadi **GitHub Actions**.

### Cara Kerja CI/CD
Setiap kali Anda melakukan `git push` ke cabang `main` or `master`, GitHub Actions akan otomatis:
1. Memulai mesin pelari (runner) Ubuntu Linux.
2. Mengunduh kode sumber dan menginstal dependensi.
3. Melakukan kompilasi produksi (`npm run build`).
4. Mengunggah dan mempublikasikan halaman HTML tunggal terbaru ke hosting GitHub Pages Anda.
