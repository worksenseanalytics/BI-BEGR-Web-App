# REKAP PENGEMBANGAN - JUNI 2026

Dokumen ini mencatat kronologis rekayasa dan pembaruan arsitektur Dasbor Pemantauan Budaya KONSOL BEGR Bank Indonesia.

## 1. Pembaruan Juni 2026: Arsitektur Murni Read-Only
- **Transformasi BeforeTripView**: Mengubah antarmuka Data Master Konsol (`BeforeTripView.tsx`) menjadi murni *Read-Only*. Menghapus seluruh tombol sunting, tambah, hapus, serta modal editor untuk memusatkan integritas data eksklusif pada spreadsheet.
- **Pulsating Badge Status**: Menambahkan badge status melayang pulsating formal berwarna slate (`bg-slate-100`) dengan detak warna indigo di sudut kanan atas judul tabel sebagai penanda status pemantauan waktu-nyata yang formal.
- **Executive KPI Cards**: Menyediakan 4 kartu ringkasan kpi di bagian atas tabel untuk menyajikan total satker, rerata kematangan, satker lulus target, dan satker butuh akselerasi secara ringkas ala Tremor.

## 2. Struktur Modul Dasbor Utama
- **OverviewView (Ringkasan Utama)**: 
  - Menyajikan tabulasi sebaran level kematangan CML (Wide, KP, KPw).
  - Visualisasi grafik batang EVP & Pilar Budaya dengan Reference Line target acuan.
  - Grafik batang Championship Program nasional.
  - Radar chart 5 dimensi Nilai-Nilai Strategis (NNS).
  - Daftar Top 3 Satker Kematangan dan Butuh Akselerasi (Bottom 3) dengan watermark besar berestetika Swiss Functional.
- **RankingView (Pemeringkatan)**: Papan peringkat dinamis (leaderboard) yang dapat diurutkan menaik/menurun lengkap dengan pencarian dan filter kelompok budker.
- **SatkerDetailView (Analisis 360°)**: Deep dive analitis per satuan kerja yang menyandingkan grafik batang capaian EVP/Pilar, Radar NNS Satker, dan rincian sub-skor 5 Championship Program.
- **SettingsView (Pengaturan)**: Form konfigurasi Judul Aplikasi, Unit Admin Budker, dan Batas Target Acuan yang tersinkronisasi dua arah langsung ke Google Sheets.

## 3. Pangkalan Data & Utilitas singlefile
- **Penyelarasan 94 Kolom**: `dataUtils.ts` diprogram presisi untuk memetakan seluruh 94 kolom data master spreadsheet murni tanpa kehilangan indeks formula.
- **Cetak Laporan**: Terintegrasi fungsi landscape print pintar (`printHelper.ts`) yang otomatis menonaktifkan dark mode sementara selama proses pencetakan untuk menjamin cetakan PDF formal berkualitas tinggi.

## 4. Pembaruan Organisasi Berkas & Konteks Filter (Juni 2026)
- **Migrasi `FilterContext.tsx`**: Memindahkan berkas penanganan filter global dari `src/components/ui/` ke folder khusus arsitektural `/src/contexts/` guna memisahkan logic filter global (state management) dari pustaka komponen presentasional UI.
- **Penyempurnaan Jalur Impor `Layout.tsx`**: Menyesuaikan jalur impor komponen tata letak utama (`Layout`) pada `src/App.tsx` agar merujuk ke lokasi barunya secara presisi di `src/components/layout/Layout.tsx`, menjamin integritas fungsional 100% bebas dari galat kompilasi TypeScript (`tsc`).

## 5. Kompilasi & Pembaruan Single-File Bundle (Juni 2026)
- **Kompilasi Otomatis via Vite**: Memproses file `index.html` di root melalui Vite build engine ke dalam folder `/dist/index.html`.
- **Sinkronisasi Kode Deployment**: Sesuai dengan instruksi sistem, hasil kompilasi terbaru di `/dist/index.html` secara otomatis disalin dan disinkronkan ke dalam berkas `Dashboard-for-Spreadsheet.html` dan `Dashboard-for-Spreadsheet.txt` melalui script `postbuild.mjs` untuk keperluan integrasi langsung ke Google Apps Script (GAS).

## 6. Pembaruan Juni 2026: Halaman Khusus Laporan KPI Konsolidasi (Executive Report Page)
- **Pembuatan `ReportView.tsx`**: Membangun modul halaman khusus untuk laporan eksekutif interaktif yang menyajikan ringkasan KPI tingkat tinggi yang bersumber secara asinkron dari data pangkalan KONSOL BEGR.
- **Bento Grid Executive Telemetry**: Menampilkan indikator makro utama meliputi Average Maturity Level (CML) berpembanding dinamis, Compliance Rate (% kelulusan unit), Average Engagement Score, dan Average NNS Impact dalam bentuk visualisasi yang elegan, responsif, dan padat.
- **Penyelarasan Desain KPI**: Menyelaraskan tata letak kartu KPI pada halaman Laporan agar identik dengan halaman Overview, termasuk penggunaan warna border kiri penanda kategori, penempatan ikon visual, lencana pencapaian (positif/negatif/netral), dan subteks penjelasan perbandingan.
- **Matriks Dimensi Strategis (EVP vs Pilar)**: Menyajikan grafik batang Recharts komparatif yang membandingkan performa rata-rata 3 dimensi EVP dan 4 pilar Kebijakan Budaya Kerja BI, lengkap dengan garis target acuan horizontal.
- **Komposisi Klasifikasi Kematangan**: Menvisualisasikan proporsi sebaran jumlah satuan kerja berdasarkan kategori kematangan budaya (*Aligned*, *Engaged*, *Enable*, *Empower*) dalam format progress bar horizontal yang selaras warna standar.
- **Matriks Program Kebudayaan**: Menyuguhkan ringkasan detail performa 5 program kebudayaan aktif (SESPIOK, AKUKEREN, OBF, 3H, PINTER) meliputi skor pencapaian rata-rata dan tingkat partisipasi di masing-masing program.
- **Sorotan Kinerja Satker (Top & Bottom Performers)**: Menampilkan 3 unit berkinerja tertinggi (*Culture Champions*) dan 3 unit prioritas pendampingan (*Below Benchmark*) untuk membantu pengambilan keputusan strategis oleh pengelola program.
- **Integrasi Filter Cakupan Eksekutif**: Menyediakan penapis cakupan tingkat tinggi (BI Wide, Kantor Pusat, Kantor Perwakilan) yang secara reaktif menyinkronkan seluruh perhitungan data pada dashboard laporan.
- **Pendaftaran Rute & Navigasi**: Mendaftarkan tab `"report"` (Laporan KPI Konsolidasi) di dalam router utama `src/App.tsx`, serta mengintegrasikannya ke menu navigasi sidebar melayang kiri pada `Layout.tsx` lengkap dengan sinkronisasi penamaan file PDF cetak kustom.
- **Redesain Premium Matriks Dimensi Strategis (EVP vs Pilar)**: Melakukan perombakan visual dan fungsional total pada visualisasi perbandingan EVP vs Pilar Budaya. Menghadirkan segmented control interaktif ("Semua Dimensi", "Hanya EVP", "Hanya Pilar"), gradien bar kustom (warm gold untuk EVP & corporate indigo untuk Pilar), indikator garis batas target kelulusan yang dipertegas, serta ringkasan analisis cerdas 3-kolom otomatis (Dimensi Terkuat, Area Prioritas Pendampingan, dan Deviasi vs Target) di bawah grafik.

## 7. Pembaruan Juni 2026: Pembersihan Ornamen Dekoratif (Swiss-Style Premium Minimalism)
- **Eliminasi Visual Clutter**: Menghapus seluruh ikon dekoratif berlatar warna kontras (`p-1.5 rounded-lg bg-...`) dari semua kartu KPI di seluruh halaman (Overview, Report, Ranking, dan Data Master/Setup) untuk melahirkan antarmuka yang sangat bersih, profesional, berfokus penuh pada kekuatan tipografi (Swiss-Style).
- **Penghapusan Lencana Non-Standar**: Menghilangkan lencana "Analisis Mendalam" pada header grafik dimensi strategis demi menjaga kesederhanaan visual yang jujur tanpa ornamen artifisial ("AI slop").
- **Kompilasi dan Sinkronisasi Otomatis**: Memastikan hasil build Vite terbaru (`dist/index.html`) secara instan dan tanpa eror disalin ke dalam file target integrasi Google Apps Script (`Dashboard-for-Spreadsheet.html` dan `Dashboard-for-Spreadsheet.txt`).

## 8. Pembaruan Juni 2026: Standarisasi Judul Visual (Premium Swiss Bold & Proper Case)
- **Konsistensi Tipografi Judul**: Menyetarakan seluruh judul visual dasbor (termasuk filter, grafik, tabel, dan sorotan metrik) agar konsisten menggunakan format **bold** (`font-bold`) dengan aturan **Proper Case** (kapitalisasi di setiap kata, contoh: *Filter Cakupan Laporan* daripada ALL CAPS).
- **Penyelarasan Font Utama**: Memastikan seluruh visual header di dalam komponen dasbor (`Overview`, `Report`, `Ranking`, `SatkerDetail`, `BeforeTrip`, `Settings`) menggunakan keluarga font yang sama dengan judul utama dasbor (`font-sans`), menghasilkan kesatuan visual yang kohesif, modern, dan sangat profesional.

## 9. Pembaruan Juni 2026: Animasi Interaktif Slider Premium & Pembersihan Lanjutan (Laporan KPI Konsolidasi)
- **Framer Motion Segmented Slider**: Mengintegrasikan `motion.div` dengan efek slider elastis (`layoutId` dan `spring transition`) pada penapis cakupan eksekutif (*Filter Cakupan Laporan*) dan filter matriks dimensi strategis (*EVP vs Pilar Budaya*), memberikan pengalaman interaksi mikro yang sangat mulus, responsif, dan bercita rasa premium.
- **Pembersihan Ikon Analisis Strategis**: Menghapus ikon dekoratif (`TrendingUp`, `AlertTriangle`, `Target`) dengan latar lingkaran/kotak kontras dari tiga kartu sorotan analisis strategis (Dimensi Terkuat, Area Prioritas Pendampingan, Deviasi Rata-Rata) untuk memaksimalkan kepatuhan terhadap standar kebersihan visual *Swiss-Style minimalism*.
- **Pembersihan Header Kartu Distribusi**: Menghapus modul header judul (*Komposisi Klasifikasi Kematangan*) dari kartu distribusi porsi satuan kerja guna memberikan estetika tampilan yang lebih mengalir, terpadu, dan bebas dari visual clutter.
- **Penyelarasan Font Metrik & Nilai (Value)**: Menyeragamkan seluruh tipe huruf untuk nilai numerik, persentase, dan label data di seluruh modul visual (`Report`, `Overview`, `Ranking`, `SatkerDetail`, `Settings`) menggunakan `font-sans` agar konsisten dengan jenis huruf yang digunakan di judul utama dasbor, menggantikan sisa-sisa penggunaan `font-mono` yang kontras.
- **Vite & GAS Sinkronisasi Instan**: Secara otomatis melakukan build ulang dan menyalin hasil bundle murni `dist/index.html` ke berkas `Dashboard-for-Spreadsheet.html` dan `Dashboard-for-Spreadsheet.txt`.

## 10. Pembaruan Juni 2026: Dinamisasi Sumbu Y Seluruh Visualisasi
- **Sumbu Y Dinamis Secara Default (Auto Fit)**: Mengaktifkan mode "Skor Sumbu Y Dinamis" secara bawaan (*default true*) pada dasbor utama untuk langsung memfokuskan visualisasi perbandingan pada variasi data aktual satuan kerja.
- **Dinamisasi Sumbu Y Grafik CP & Laporan**: Mengganti sumbu Y statis `domain={[0, 5]}` pada grafik *Rata-Rata Skor per Championship Program (CP)* dan grafik perbandingan *EVP vs Pilar Budaya* dengan domain dinamis adaptif `[dataMin - 0.2, dataMax + 0.2]` (dibatasi minimal 0 dan maksimal 5). Ini mencegah grafik tampak datar dan memberikan visualisasi perubahan tren yang jauh lebih presisi dan bermakna.

## 11. Pembaruan Juni 2026: Penghapusan Warna Sisi Kiri Setiap Kartu KPI & Ringkasan Performa
- **Pembersihan Border Sisi Kiri (Clutter Removal)**: Menghapus seluruh border tebal berwarna (`border-l-4 border-l-...` dan `border-l-2`) yang sebelumnya menempel di sisi kiri setiap kartu KPI ringkasan, kartu performa (Top vs Bottom Performer), kartu detail analisis taktis, serta baris peringkat utama. Ini menghasilkan tata letak dasbor yang benar-benar bersih, elegan, dan sejalan dengan standar desain minimalis modern.
- **Pembersihan Kartu Profil Satker**: Menghapus border-left berwarna dinamis (`borderLeft: 4px solid cmlColor`) pada kartu profil utama Satker di halaman eksplorasi detail profil satuan kerja, menyempurnakan keselarasan visual flat-edge di seluruh modul aplikasi.

## 12. Pembaruan Juni 2026: Dropdown Standar Terkategori & Pencegahan Clipping Nama Kategori Panjang
- **Dropdown Custom Searchable Terkategori Satker**: Menggantikan kembali select box HTML standar dengan Custom Searchable Dropdown yang super responsif dan modern. Modul ini menyaring Satuan Kerja secara real-time berdasarkan input teks pencarian pengguna.
- **Penyempurnaan Struktur Pengelompokan & Overflow-Visible**: Opsi satuan kerja tetap disajikan dalam pengelompokan yang sangat rapi berdasarkan "Kelompok Budker" (misal: *KP A*, *KP B*, dll.). Menghilangkan tag `overflow-hidden` pada kontainer induk utama dan membungkus elemen dekoratif radial blur secara terpisah untuk memastikan daftar opsi melayang di atas semua komponen (z-index tinggi) dan terbebas dari isu pemotongan/clipping visual baik di layar desktop, mobile, maupun iframe.
- **Dropdown Custom Championship Program (CP)**: Menggantikan select box bawaan browser pada menu pemilihan program evaluasi detail komponen dengan Custom Floating Dropdown yang elegan, dilengkapi transisi micro-animation halus, ikon Chevron dinamis, dan backdrop penutup transparan. Ini mengoptimalkan estetika visual dan kegunaan interaksi tanpa merusak tata letak grafik.
- **Pencegahan Potong Label Sumbu Y Recharts**: Meluaskan lebar (`width={180}`) sumbu Y pada grafik detail komponen Championship Program (CP) untuk memastikan nama parameter evaluasi panjang (seperti *"NNS: Coordination & Teamwork"*) tertayang lengkap, presisi, dan proporsional.
- **Membatasi Desimal Panjang pada Sumbu Nilai (Y-Axis/X-Axis)**: Menambahkan `tickFormatter` pada sumbu nilai numerik (baik sumbu Y pada chart vertikal maupun sumbu X pada chart horizontal) di seluruh modul visualisasi (Overview, Detail Satker, dan Laporan). Trik ini secara dinamis membatasi angka desimal panjang menjadi maksimal 2 angka di belakang koma (misalnya `3.3333333` menjadi `3.33`), menjaga estetika visual sumbu tetap presisi, bersih, dan rapi.
- **Reduksi Radius Bayangan Sidebar (Softer Shadow)**: Mengurangi kepekatan dan radius bayangan pada komponen Sidebar (`aside`) dari `shadow-2xl` menjadi `shadow-md` (saat diperluas) dan dari `shadow-lg` menjadi `shadow-sm` (saat diringkas) untuk menghadirkan kontras visual yang lebih lembut, flat, dan elegan sesuai dengan filosofi desain modern.
- **Scroll Vertikal Grafik Detail CP**: Membungkus ResponsiveContainer barchart Detail CP ke dalam container `overflow-y-auto scrollbar-thin` setinggi `h-64`, serta menskalakan tinggi grafik secara dinamis (misal: `Math.max(240, length * 30)`). Solusi ini menghadirkan scrollbar tipis yang super halus ketika jumlah komponen sangat banyak, mencegah tabrakan/pemampatan visual antar baris grafik.
- **Fitur Ekspansi Tampilan Penuh (Fullscreen Popup Modal)**: Menyediakan tombol ikon `Maximize2` (Expand) di samping judul panel Detail CP yang memicu modal overlay berukuran penuh (`max-w-4xl max-h-[90vh]`) dengan z-index tinggi dan efek backdrop buram. Di dalam modal ini, grafik digambar ulang secara lega dengan tinggi dinamis yang longgar, lengkap dengan tombol penutup (`X`) dan backdrop penutup interaktif, sehingga memudahkan analisis komprehensif tanpa pemotongan label sumbu.
- **Pembersihan & Penghapusan Visual Radar Chart**: Menghapus grafik radar "Radar Dinamika 4 Tahap Penilaian Program" sesuai instruksi guna menyederhanakan antarmuka dan memfokuskan analisis.
- **Penyelarasan Tata Letak Kartu Dampak NNS**: Menata ulang komponen "Dampak Nilai-Nilai Strategis (NNS)" menjadi lebar penuh (`w-full`) dengan tata letak grid 2 kolom pada layar desktop (`grid-cols-1 md:grid-cols-2`) sehingga visualisasi bar diagram kematangan perilaku kerja ini tetap berimbang, rapi, dan memaksimalkan ruang secara elegan.
- **Pembaruan Juni 2026: Optimasi Tampilan Responsif Tablet & Mobile**:
  - **Penyusutan Margin Kanan & Kiri Dinamis**: Mengubah margin kiri pada pembungkus konten utama (`lg:ml-24`) menjadi responsif dinamis (`showLabels ? "lg:ml-[304px] xl:ml-[336px]" : "lg:ml-24"`) untuk mencegah tabrakan/tumpang tindih visual antara Sidebar desktop dengan konten halaman ketika menu sidebar diperluas.
  - **Auto-Hide Teks Tombol Sinkronisasi**: Menyembunyikan teks label tombol "Sinkronisasi" (`hidden xl:inline`) pada resolusi tablet/mobile, menyisakan ikon petir (`Zap`/`Loader2`) yang sangat ringkas dan manis guna menghemat ruang horizontal secara masif.
  - **Penyembunyian Quick Search di Bawah Desktop**: Menggeser visibilitas komponen pencarian cepat di header utama dari `hidden md:flex` menjadi `hidden lg:flex` untuk memberi ruang lega bagi nama instansi/judul halaman yang panjang pada layar tablet berukuran sedang.
  - **Skalabilitas Teks Judul & Subtitle**: Menyesuaikan skala font judul halaman (`text-sm sm:text-base md:text-lg lg:text-xl`) dan batasan pemotongan teks subtitle (`max-w-[130px]`) agar tetap proporsional dan tidak pernah keluar dari batas grid/kontainer navbar.
  - **Dukungan Rotasi & Orientasi Tablet (Portrait & Landscape)**:
    - **Detail Satker Grid**: Mengubah tata letak unit identity dan ring chart pada `SatkerDetailView.tsx` menjadi `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, sehingga ketika tablet diputar (mode landscape maupun portrait), kartu informasi identitas dan ring chart kematangan CML akan berdiri sejajar di baris pertama, sedangkan grafik komponen CP mengambil porsi `md:col-span-2 lg:col-span-2` di baris berikutnya untuk keseimbangan visual yang sempurna.
    - **Overview CP Grid**: Memodifikasi container CP Averages pada `OverviewView.tsx` dari `lg:grid-cols-5` menjadi `md:grid-cols-5` dengan pembagian kolom `md:col-span-3` dan `md:col-span-2`. Penataan ini memungkinkan visualisasi grafik batang program CP serta tabel rangkumannya bersanding secara horizontal pada resolusi tablet (baik portrait maupun landscape), menghindarkan susunan bertumpuk yang memakan terlalu banyak ruang vertikal.





