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
    botNumber: "62816549769011", // Nomor telepon bot

    // Daftar administrator
    administrator: [
        "6281654976901", // Nomor telepon administrator pertama
        "6285175023775"  // Nomor telepon administrator kedua
    ],

    // Konfigurasi whitelist
    whitelist: false, // Setel ke true untuk mengaktifkan fitur whitelist
    whitelistUsr: [
        "62816549769011" // Nomor telepon pengguna yang di-whitelist
    ]
};
```

## Penggunaan

Jalankan bot dengan perintah `node controller.js`.

## TODO

- [ ] Implementasikan fitur pengunduh media sosial
- [ ] Tambahkan dokumentasi yang komprehensif
- [ ] Perbaiki penanganan kesalahan dan logging

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan ikuti panduan berikut:
- Fork repositori ini
- Buat branch baru
- Lakukan perubahan dan commit
- Push ke branch dan buat pull request

## Menambahkan Plugin

Untuk menambahkan plugin, silakan gunakan format berikut:

```js
module.exports = {
    admin: false,
    name: 'name',
    alias: ['alias1', 'alias2'],
    category: 'test',
    run: async (m, plugins) => {
        // Here is your code
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