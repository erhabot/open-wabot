# Open WABOT

Open WABOT adalah sebuah bot WhatsApp yang dirancang seringan mungkin menggunakan modul [Baileys](https://github.com/WhiskeySockets/Baileys).

## Instruksi Pemasangan

Berikut adalah instruksi pemasangan Open WABOT pada beberapa platform.

### Arch Linux

1. Install nodejs, npm, dan git.
```bash
sudo pacman -S nodejs npm git
```

2. Clone repositori Open WABOT.
```bash
git clone https://github.com/Ismananda/open-wabot
```

3. Masuk ke direktori open-wabot dan jalankan npm install.
```bash
cd open-wabot
npm install
```

### Debian / Ubuntu

1. Install curl dan git.
```bash
sudo apt-get install -y curl git
```

2. Unduh dan jalankan setup Node.js.
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs
```

3. Clone repositori Open WABOT.
```bash
git clone https://github.com/Ismananda/open-wabot
```

4. Masuk ke direktori open-wabot dan jalankan npm install.
```bash
cd open-wabot
npm install
```

## Konfigurasi

Untuk konfigurasi, salin file `config-sample.js` menjadi `config.js` di direktori utama.
```js
module.exports = {
    // Konfigurasi mode debug
    debug: false, // Setel ke true untuk mengaktifkan mode debug

    // Konfigurasi fitur anti-panggilan
    antiCall: true, // Setel ke true untuk mengaktifkan fitur anti-panggilan

    // Konfigurasi mode pairing
    usePairing: false, // Setel ke true untuk menggunakan mode pairing

    // Konfigurasi prefix
    prefixes: ["!", ">", "$", ".", "-", "+", "?", "#", "@", "/", "&", ",", "ow!"], // Tambahkan karakter yang ingin Anda gunakan sebagai prefix

    // Informasi bot
    botName: "Open WABOT", // Nama bot
    botNumber: "6285176765422", // Nomor telepon bot

    // Daftar administrator
    administrator: [
        "6281654976901", // Nomor telepon administrator pertama
        "6285175023755"  // Nomor telepon administrator kedua
    ],

    // Konfigurasi whitelist
    whitelist: false, // Setel ke true untuk mengaktifkan fitur whitelist
    whitelistSrv: "http://localhost:8080/whitelist", // Server yang menyediakan daftar putih
    whitelistMsg: "You are not allowed to use this bot", // Pesan yang dikirim kepada pengguna saat mereka tidak ada di daftar putih
    whitelistUsr: [
        "6285176765422" // Nomor telepon pengguna yang di-whitelist
    ]
};
```

## Daftar putih

Nomor yang dimasukkan kedalam array daftar putih didalam file konfigurasi bersifat permanen hingga file konfigurasi diubah. Jika ada ingin menambahkan whitelist dalam jangka waktu tertentu, anda bisa menggunakan perintah seperti berikut.

```
.whitelist <nomor> <durasi dengan satuan hari>

.whitelist 6285176765422 30
```

Pada konfigurasi whitelistSrv bisa diisi dengan url server yang akan menerima dan mengembalikan data json seperti berikut.

Data yang akan diterima oleh server.
```json
{
    "user": "6285176765422"
}
```
Data yang akan dikembalikan oleh server.
```json
{
    "whitelisted": true/false
}
```

## Penggunaan

Jalankan bot dengan perintah `node controller.js`.

## Menambahkan Plugin

Untuk menambahkan plugin, silakan gunakan format berikut:

```js
module.exports = {
    admin: false, // Apakah plugin khusus administrator
    name: 'name', // Nama fitur yang ditambahkan
    alias: ['alias1', 'alias2'], // Nama lain dari fitur bisa digunakan sebagai perintah alternatif
    category: 'test', // Kategori dari fitur yang ditambahkan
    run: async (m, plugins) => {
        // Disini kodemu dijalankan
        m.reply(result)
    }
}
```

## Links

[![WhatsApp Community](https://img.shields.io/badge/community-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/IV57VaY23wHLSn0LdOTNmC)
[![Github Discussion](https://img.shields.io/badge/discussion-5F5F5F?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ismananda/open-wabot/discussions)

## Lisensi

Proyek ini dilisensikan di bawah lisensi yang tertera di file [LICENSE](LICENSE).

- [English Version](README.md)