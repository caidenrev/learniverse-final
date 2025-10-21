# Learniverse: Asisten Belajar Cerdas Bertenaga AI

Selamat datang di Learniverse, sebuah platform inovatif yang dirancang untuk memberdayakan siswa dan akademisi dengan seperangkat alat canggih berbasis kecerdasan buatan (AI). Misi kami adalah untuk mengatasi berbagai tantangan akademis, mempercepat proses belajar, dan membantu pengguna mencapai potensi penuh mereka.

Aplikasi ini dibangun oleh **Revan (Eka Revandi)**, seorang Cloud Architect dan Software Engineer yang bersemangat dalam menggabungkan teknologi cloud dan AI untuk menciptakan solusi pendidikan yang transformatif.

## ✨ Fitur Unggulan

Learniverse dilengkapi dengan berbagai fitur cerdas yang dirancang khusus untuk mendukung berbagai kebutuhan akademis, mulai dari tahap awal pencarian ide hingga penyelesaian tugas akhir.

### 🧠 Katalisator Ide

- **Brainstorm Topik**: Mengalami kebuntuan ide? Fitur ini membantu Anda menghasilkan berbagai ide sub-topik yang menarik dan relevan dari sebuah tema atau mata kuliah umum, memberikan percikan inspirasi untuk proyek Anda selanjutnya.
- **Kerangka Presentasi**: Ubah judul presentasi Anda menjadi sebuah kerangka yang logis dan terstruktur. AI akan menyusun alur slide demi slide, mulai dari pendahuluan, isi, hingga kesimpulan.
- **Pencari Analogi**: Menyederhanakan konsep teknis yang rumit menjadi lebih mudah dipahami. Fitur ini menyediakan analogi sederhana dan relevan untuk menjelaskan ide-ide kompleks dengan cara yang intuitif.

### 📚 Asisten Riset & Penulisan

- **Kerangka Penelitian**: Memulai skripsi atau tesis menjadi lebih mudah. Dapatkan draf kerangka penelitian yang terstruktur sesuai dengan standar akademis di Indonesia, mencakup bab-bab penting seperti latar belakang, tinjauan pustaka, metodologi, dan lainnya.
- **Pencari Referensi Cerdas**: Tingkatkan efektivitas pencarian literatur Anda di Google Scholar. Fitur ini memberikan rekomendasi kata kunci alternatif dan terkait untuk memperluas dan memperdalam pencarian referensi Anda.
- **Parafrase Akademik**: Hindari plagiarisme dengan tetap menjaga integritas makna. Alat ini membantu menyusun ulang kalimat atau paragraf dari sumber akademis dengan gaya bahasa yang berbeda namun tetap akurat.
- **Peringkas Jurnal**: Pahami inti dari jurnal atau artikel berbahasa Inggris yang padat dalam waktu singkat. AI akan meringkas poin-poin kunci ke dalam Bahasa Indonesia yang ringkas dan mudah dimengerti.

### 🎓 Asisten Belajar Personal

- **Tutor AI**: Jangan biarkan pertanyaan menumpuk. Unggah materi kuliah Anda (seperti PDF atau catatan), dan ajukan pertanyaan spesifik. AI akan bertindak sebagai tutor pribadi yang menjawab pertanyaan Anda berdasarkan konteks dokumen yang diberikan.
- **Roadmap Belajar**: Ingin menguasai keterampilan atau topik baru? Masukkan topik yang Anda minati, dan AI akan membuatkan roadmap belajar (roadmap) yang terstruktur, langkah demi langkah, dari tingkat pemula hingga mahir.
- **CV Reviewer**: Dapatkan keunggulan kompetitif di dunia kerja. Unggah CV Anda dan biarkan AI yang bertindak sebagai seorang HR profesional memberikan ulasan, skor, serta saran perbaikan yang konkret dan membangun.

## 🚀 Teknologi yang Digunakan

- **Frontend**: Next.js & React
- **Styling**: Tailwind CSS & shadcn/ui
- **AI & Generative**: Google Genkit & Gemini

## 🏗️ Arsitektur Aplikasi

Aplikasi ini dirancang dengan arsitektur modern yang memisahkan antara lapisan presentasi (frontend) dan logika AI (backend generatif).

```mermaid
graph TD
    subgraph Pengguna
        A[Browser]
    end

    subgraph Infrastruktur Aplikasi (Next.js)
        B[Komponen React / Halaman]
        C[Server Actions]
    end

    subgraph Lapisan AI (Genkit)
        D[Genkit Flows]
        E[Konfigurasi Model & Prompt]
    end
    
    subgraph Google Cloud
        F[Google AI / Model Gemini]
    end

    A -- Interaksi Pengguna --> B
    B -- Memanggil Fitur (misal: Submit Form) --> C
    C -- Meneruskan Input Pengguna --> D
    D -- Menggunakan Konfigurasi --> E
    D -- Memanggil Model AI --> F
    F -- Mengembalikan Hasil --> D
    D -- Mengembalikan Output --> C
    C -- Mengirim Data ke Client --> B
    B -- Menampilkan Hasil ke Pengguna --> A

    style Pengguna fill:#D0BFFF,stroke:#333,stroke-width:2px
    style "Infrastruktur Aplikasi (Next.js)" fill:#ADD8E6,stroke:#333,stroke-width:2px
    style "Lapisan AI (Genkit)" fill:#F5F5F5,stroke:#333,stroke-width:2px
    style "Google Cloud" fill:#FFDDC1,stroke:#333,stroke-width:2px
```

### Alur Arsitektur Fitur

Setiap fitur di Learniverse mengikuti alur yang konsisten:

1.  **UI (Komponen React)**: Pengguna memasukkan data (teks atau file) melalui antarmuka yang dibangun dengan komponen React dan Shadcn/UI. Validasi input ditangani oleh `React Hook Form` dan `Zod`.
2.  **Server Action**: Saat formulir dikirim, sebuah *Next.js Server Action* dipanggil. Ini berfungsi sebagai jembatan yang aman antara frontend dan backend.
3.  **Genkit Flow**: *Server Action* memanggil *Genkit Flow* yang sesuai (`/src/ai/flows/*.ts`). *Flow* ini berisi logika spesifik untuk fitur tersebut, termasuk *prompt engineering* yang dirancang untuk mendapatkan output terbaik dari model.
4.  **Model Gemini**: *Genkit Flow* mengirimkan *prompt* yang sudah diproses ke model bahasa Gemini melalui Google AI Platform.
5.  **Respons**: Model Gemini menghasilkan respons, yang kemudian diterima kembali oleh *Genkit Flow*, diteruskan ke *Server Action*, dan akhirnya ditampilkan kepada pengguna di UI.

Pola ini memastikan bahwa setiap fitur bersifat modular, aman (karena kunci API tidak terekspos di sisi klien), dan mudah dikelola.

Terima kasih telah menggunakan Learniverse! Kami berharap aplikasi ini dapat menjadi mitra setia dalam perjalanan akademis Anda.
