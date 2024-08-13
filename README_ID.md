[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#table-of-contents)
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
    npm install --omit=optional
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
    npm install --omit=optional
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

    // Konfigurasi Sesi
    sessions: {
        mongodb: "", // Ubah dengan URL MongoDB untuk menggunakan sesi mongodb
    },

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

### Menggunakan Sesi MongoDB
Untuk menggunakan sesi MongoDB, silakan ikuti langkah-langkah berikut:

1. **Pasang driver sesi MongoDB**  
    Jalankan perintah berikut untuk memasang driver sesi MongoDB:
    ```bash
    npm run install:mongo
    ```

2. **Konfigurasikan URL MongoDB**  
    Tambahkan URL MongoDB Anda ke dalam konfigurasi seperti ini:
    ```js
    sessions: {
        mongodb: "mongodb://username:password@host:port/database?options",
    },
    ```
    **Contoh:**
    ```js
    sessions: {
        mongodb: "mongodb://myUser:myPassword@localhost:27017/myDatabase?retryWrites=true&w=majority",
    },
    ```

3. **Jalankan bot**  
    Jalankan bot dengan perintah berikut:
    ```bash
    npm start
    ```

### Daftar putih

Nomor yang dimasukkan kedalam array daftar putih didalam file konfigurasi bersifat permanen hingga file konfigurasi diubah. Jika ada ingin menambahkan whitelist dalam jangka waktu tertentu, anda bisa menggunakan perintah seperti berikut.
```
.whitelist <nomor> <durasi dengan satuan hari>
```

Contoh:
```
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
    "whitelisted": true
}
```
```json
{
    "whitelisted": true
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

## Terimakasih kepada
<table>
  <tr>
    <td align="center"><a href="https://github.com/Ismananda"><img src="https://github.com/Ismananda.png?size=100" width="100px;" alt=""/><br /><sub><b>Ismananda</b></sub></a><br /><sub><i>Penulis open-wabot</i></sub></td>
    <td align="center"><a href="https://github.com/KilluaBot"><img src="https://github.com/KilluaBot.png?size=100" width="100px;" alt=""/><br /><sub><b>Rusdi Greyrat</b></sub></a><br /><sub><i>Pembantu Umum</i></sub></td>
        <td align="center"><a href="https://github.com/WhiskeySockets/Baileys"><img src="https://github.com/WhiskeySockets.png?size=100" width="100px;" alt=""/><br /><sub><b>WhiskeySockets - Baileys</b></sub></a><br /><sub><i>Perpustakaan yang digunakan</i></sub></td>
      <td align="center"><a href="https://github.com/adiwajshing"><img src="https://github.com/adiwajshing.png?size=100" width="100px;" alt=""/><br /><sub><b>Adhiraj Singh</b></sub></a><br /><sub><i>Pendiri Baileys</i></sub></td>
      <td align="center"><a href="https://github.com/amiruldev20"><img src="https://github.com/amiruldev20.png?size=100" width="100px;" alt=""/><br /><sub><b>Amirul Dev</b></sub></a><br /><sub><i>Penulis sesi mongodb</i></sub></td>
  </tr>
</table>
