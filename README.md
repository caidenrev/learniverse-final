# Learniverse: Asisten Belajar Cerdas Bertenaga AI

Selamat datang di Learniverse, sebuah platform inovatif yang dirancang untuk memberdayakan siswa dan akademisi dengan seperangkat alat canggih berbasis kecerdasan buatan (AI). Misi kami adalah untuk mengatasi berbagai tantangan akademis, mempercepat proses belajar, dan membantu pengguna mencapai potensi penuh mereka.

Aplikasi ini dibangun oleh **Revan (Eka Revandi)**, seorang Cloud Architect dan Software Engineer yang bersemangat dalam menggabungkan teknologi cloud dan AI untuk menciptakan solusi pendidikan yang transformatif.

## ✨ Fitur Unggulan

Learniverse dilengkapi dengan berbagai fitur cerdas yang dirancang khusus untuk mendukung berbagai kebutuhan akademis, mulai dari tahap awal pencarian ide hingga penyelesaian tugas akhir.

### 🧠 Katalisator Ide & Kreativitas
- **Brainstorm Topik**: Menghasilkan ide sub-topik yang menarik dari sebuah tema umum.
- **Kerangka Presentasi**: Mengubah judul menjadi kerangka slide yang logis dan terstruktur.
- **Pencari Analogi**: Menyederhanakan konsep teknis yang rumit menjadi lebih mudah dipahami.
- **Roadmap Belajar**: Membuat roadmap belajar terstruktur untuk menguasai keterampilan baru.
- **Pembuat Pertanyaan**: Menghasilkan daftar pertanyaan dari materi pelajaran untuk kuis atau diskusi.

### 📚 Asisten Riset & Penulisan
- **Kerangka Penelitian**: Membuat draf kerangka skripsi atau tesis sesuai standar akademis.
- **Pencari Referensi Cerdas**: Memberikan rekomendasi kata kunci alternatif untuk riset literatur.
- **Parafrase Akademik**: Menyusun ulang kalimat untuk menghindari plagiarisme dengan tetap menjaga makna.
- **Peringkas Jurnal & Dokumen**: Meringkas artikel atau dokumen (PDF/Word) ke dalam Bahasa Indonesia.
- **Jawaban Cepat**: Mengunggah dokumen soal (PDF/JPG) dan membiarkan AI menjawabnya.

### 🎓 Asisten Profesional & Personal
- **Tutor AI**: Bertanya jawab dengan AI berdasarkan konteks materi kuliah yang diunggah.
- **CV Reviewer**: Mendapatkan ulasan, skor, dan saran perbaikan untuk CV dari AI yang bertindak sebagai HR.
- **Code Review**: Menjalankan kode (JavaScript), dan jika terjadi error, AI akan menjelaskan masalah serta solusinya.

## 🚀 Tumpukan Teknologi (Tech Stack)

Aplikasi ini dibangun di atas tumpukan teknologi modern yang berfokus pada kinerja, skalabilitas, dan pengalaman pengembang.

- **Framework Utama**: **Next.js (App Router)** & **React** - Untuk membangun antarmuka pengguna yang cepat dan responsif dengan Server-Side Rendering (SSR) dan Static Site Generation (SSG).
- **Bahasa**: **TypeScript** - Untuk memastikan keamanan tipe dan meningkatkan kualitas kode.
- **Styling**: **Tailwind CSS** & **Shadcn/UI** - Untuk desain yang konsisten, modern, dan dapat disesuaikan.
- **Manajemen Form**: **React Hook Form** & **Zod** - Untuk validasi skema dan formulir yang andal.
- **AI & Generative Layer**: **Google Genkit** - Sebagai orkestrator backend yang merutekan permintaan ke model AI yang sesuai.
- **Model AI**: **Google Gemini (via Vertex AI)** - Sebagai otak di balik semua fitur generatif.
- **Database**: **Cloud Firestore** - Database NoSQL yang serverless, skalabel, dan real-time untuk menyimpan data pengguna, langganan, dan transaksi.
- **Autentikasi**: **Firebase Authentication** - Untuk mengelola login pengguna yang aman melalui email/password dan Google.
- **Infrastruktur & Hosting**: **Firebase App Hosting** - Platform terkelola penuh yang secara otomatis membangun dan men-deploy aplikasi Next.js menggunakan infrastruktur Google Cloud (seperti Cloud Run dan Cloud Build).
- **Gerbang Pembayaran**: **Midtrans** - Untuk memproses pembayaran langganan dengan aman.
- **Analitik & Performa**: **Vercel Analytics** & **Speed Insights** - Untuk memantau lalu lintas dan kinerja aplikasi.

## 🏗️ Arsitektur Aplikasi

Learniverse dirancang dengan **Arsitektur Aplikasi Web Serverless**. Arsitektur ini tidak bergantung pada server tradisional yang berjalan terus-menerus. Sebaliknya, ia memanfaatkan layanan terkelola dari Google Cloud yang hanya aktif saat ada permintaan, membuatnya sangat efisien, skalabel, dan hemat biaya.

```mermaid
graph TD
    subgraph Pengguna
        A[Browser/PWA]
    end

    subgraph "Google Cloud & Firebase Infrastructure"
        B(Firebase App Hosting)
        C(Firebase Authentication)
        D(Cloud Firestore)
        E(Google AI Platform / Vertex AI)
        F[Genkit Flows on Cloud Run]
    end
    
    A -- HTTPS Request --> B
    B -- SSR/Static Files --> A
    A -- Login/Register --> C
    C -- User Token --> A

    subgraph "Alur Fitur AI (Server-Side)"
        G[1. Komponen React (Client)]
        H[2. Next.js Server Action]
        I[3. Genkit Flow]
        J[4. Model Gemini]
    end

    A -- Interaksi Fitur --> G
    G -- Panggil (misal: onSubmit) --> H
    H -- Memanggil Flow --> I
    I -- Memanggil Model --> J
    J -- Mengembalikan Hasil --> I
    I -- Mengembalikan Output --> H
    H -- Mengirim Data ke Client --> G
    G -- Menampilkan Hasil --> A
    
    I -- (Opsional) Read/Write Data --> D
    H -- Membutuhkan Auth --> C
    
    style Pengguna fill:#D0BFFF,stroke:#333,stroke-width:2px
    style "Google Cloud & Firebase Infrastructure" fill:#FFDDC1,stroke:#333,stroke-width:2px
    style "Alur Fitur AI (Server-Side)" fill:#ADD8E6,stroke:#333,stroke-width:2px
```

### Penjelasan Alur Arsitektur

1.  **Hosting & Pengguna**: Aplikasi Next.js di-hosting menggunakan **Firebase App Hosting**. Saat pengguna mengakses web, App Hosting akan menyajikan file statis dan halaman yang di-render di server.
2.  **Autentikasi**: Pengguna login melalui **Firebase Authentication**. Setelah berhasil, klien menerima token (ID Token) yang digunakan untuk memverifikasi identitas pada permintaan selanjutnya.
3.  **Eksekusi Fitur (Client-Side)**: Pengguna berinteraksi dengan komponen React, misalnya mengisi formulir untuk fitur "Peringkas Jurnal".
4.  **Server Actions**: Saat formulir dikirim, sebuah **Next.js Server Action** dipanggil. Ini adalah fungsi yang berjalan aman di sisi server. Server Action ini menerima input dari pengguna dan bertindak sebagai jembatan ke lapisan AI.
5.  **Genkit Flows**: Server Action memanggil **Genkit Flow** yang relevan (terletak di `/src/ai/flows`). Flow ini berisi logika spesifik, termasuk *prompt engineering* yang telah dirancang untuk model Gemini. Flow ini berjalan di lingkungan serverless (Cloud Run) yang dikelola oleh Firebase App Hosting.
6.  **Panggilan Model AI**: Genkit Flow mengirimkan *prompt* yang sudah diproses ke model **Gemini** melalui **Google AI Platform (Vertex AI)**.
7.  **Database**: Jika diperlukan (misalnya saat memeriksa status langganan atau menyimpan riwayat), Genkit Flow atau Server Action dapat berinteraksi langsung dengan **Cloud Firestore**. Aturan Keamanan (Security Rules) Firestore memastikan bahwa setiap pengguna hanya dapat mengakses datanya sendiri.
8.  **Respons**: Hasil dari model Gemini dikembalikan melalui alur yang sama (Genkit Flow -> Server Action -> Komponen React) dan akhirnya ditampilkan kepada pengguna.

Pola ini memastikan bahwa:
-   **Kunci API Aman**: Kunci API untuk layanan Google AI dan Midtrans tidak pernah terekspos di browser.
-   **Skalabilitas**: Setiap bagian dari arsitektur (hosting, fungsi AI, database) dapat menskalakan secara independen sesuai permintaan.
-   **Modularitas**: Setiap fitur AI terenkapsulasi dalam Genkit Flow-nya sendiri, membuatnya mudah dikelola dan diperbarui.

## 🗃️ Model & Struktur Database (Firestore)

Database aplikasi menggunakan Cloud Firestore dengan struktur data yang berpusat pada pengguna (user-centric). Semua data terkait pengguna disimpan dalam sub-koleksi di bawah dokumen pengguna tersebut.

```
/users/{userId} (Dokumen)
  - uid: string
  - email: string
  - displayName: string
  - photoURL: string
  - createdAt: timestamp
  
  /subscriptions/{subscriptionId} (Sub-koleksi)
    - planId: 'free' | 'premium'
    - status: 'active' | 'cancelled'
    - usage: { ... } (map)

  /transactions/{transactionId} (Sub-koleksi)
    - orderId: string
    - amount: number
    - status: 'pending' | 'success' | 'failed'
    - createdAt: timestamp
```

Aturan Keamanan Firestore diterapkan secara ketat untuk memastikan bahwa pengguna hanya dapat membaca dan menulis datanya sendiri, menegakkan privasi dan keamanan data.

Terima kasih telah menggunakan Learniverse! Kami berharap aplikasi ini dapat menjadi mitra setia dalam perjalanan akademis Anda.
