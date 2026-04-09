# Website Naposobulung HKBP Mustikajaya

Ini adalah website resmi Naposobulung HKBP Mustikajaya (NHKBP MJ), sebuah komunitas pemuda di gereja HKBP Mustikajaya.

- Dibangun dengan: HTML, CSS (Tailwind), JavaScript
- Tujuan: Berbagi informasi tentang komunitas pemuda, kegiatan, galeri, dan detail kontak.
- Dideploy di: https://nhkbpmj.vercel.app

## Peningkatan UI / Sistem Desain (2025-11)

Peningkatan yang difokuskan pada aksesibilitas, konsistensi, dan tema:

### Token Desain
Didefinisikan di `src/style.css` di bawah `:root` dan diganti di `.dark`:
```
--primary / --primary-hover
--secondary
--accent / --accent-hover
--surface / --surface-alt
--border
--shadow-color
--text / --text-muted
--focus-ring
```
Gunakan variabel ini untuk komponen baru, bukan warna hardcoded.

### Mode Gelap
Tombol toggle (`#theme-toggle`, `#theme-toggle-mobile`) menyimpan preferensi melalui `localStorage (theme-preference)`.
Implementasi menambah/menghapus class `dark` pada `<html>` (`document.documentElement`).

### Aksesibilitas
- Ditambahkan `role="dialog"`, `aria-modal="true"`, dan label untuk modal/lightbox.
- Ditambahkan outline fokus melalui `:focus-visible` dan styling ring yang konsisten.
- Navigasi memiliki `role="navigation"` dan pelabelan yang tepat.

### Performa & UX
- Logo sekarang memiliki `width/height` eksplisit untuk mengurangi pergeseran layout.
- Pengguna yang memilih gerakan tereduksi mendapatkan animasi yang diminimalkan melalui `prefers-reduced-motion`.

### Pengembangan
Saat menambahkan elemen interaktif baru:
- Lebih suka tombol dengan `aria-label` untuk ikon saja.
- Gunakan pola `.theme-toggle-btn` untuk kontrol kompak.
- Gunakan warna berbasis token dan transisi dengan `var(--transition-base)`.

## Pengembangan Lokal

Buka `index.html` melalui server statis sederhana (opsional untuk pengujian lokal routing/hash behavior):
```bash
python3 -m http.server 8080
```
Visit http://localhost:8080/src/index.html

## Future Suggestions
- Componentize repeated card patterns.
- Add semantic landmarks (`<main>`) wrapper.
- Integrate service worker for asset caching if needed.

