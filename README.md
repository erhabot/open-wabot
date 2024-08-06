# Open WABOT

Open WABOT is a WhatsApp bot designed to be as lightweight as possible using the [Baileys](https://github.com/WhiskeySockets/Baileys) module.

## Install Instructions

Here are the instructions for installing Open WABOT on multiple platforms.

### Arch Linux

1. Install nodejs, npm, and git.
```bash
sudo pacman -S nodejs npm git
```

2. Clone the Open WABOT repository.
```bash
git clone https://github.com/Ismananda/open-wabot
```

3. Navigate to the `open-wabot` directory and run `npm install`.
```bash
cd open-wabot
npm install
```

### Debian / Ubuntu

1. Install curl and git.
```bash
sudo apt-get install -y curl git
```

2. Download and run the Node.js setup.
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs
```

3. Clone the Open WABOT repository.
```bash
git clone https://github.com/Ismananda/open-wabot
```

4. Navigate to the `open-wabot` directory and run `npm install`.
```bash
cd open-wabot
npm install
```

## Configuration

For configuration, copy `config-sample.js` to `config.js` in the root directory. Then, adjust the configuration as needed.
```js
module.exports = {
    // Debug mode configuration
    debug: false, // Set to true to enable debug mode

    // Anti-call feature configuration
    antiCall: true, // Set to true to enable anti-call feature

    // Pairing mode configuration
    usePairing: false, // Set to true to use pairing mode

    // Prefix configuration
    prefixes: ["!", ">", "$", ".", "-", "+", "?", "#", "@", "/", "&", ",", "ow!"], // Add the character you want to use as a prefix

    // Bot information
    botName: "Open WABOT", // Name of the bot
    botNumber: "62816549769011", // Phone number of the bot

    // Administrators list
    administrator: [
        "6281654976901", // Phone number of the first administrator
        "6285175023775"  // Phone number of the second administrator
    ],

    // Whitelist configuration
    whitelist: false, // Set to true to enable whitelist feature
    whitelistUsr: [
        "62816549769011" // Phone number of the whitelisted user
    ]
};
```

## Usage

Run the bot with the command
```bash
node controller.js
```

## TODO

- [ ] Implement social media downloader feature
- [ ] Add comprehensive documentation
- [ ] Improve error handling and logging

## Adding Plugins

To add a plugin, please use the following format:

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

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.

- [Versi Bahasa Indonesia](README_ID.md)