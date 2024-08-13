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
    npm install --no-optional
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
    npm install --no-optional
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

    // Session configuration
    sessions: {
        mongodb: "", // Change with your Mongodb URL to use the Mongodb session
    },

    // Bot information
    botName: "Open WABOT", // Name of the bot
    botNumber: "6285176765422", // Phone number of the bot

    // Administrators list
    administrator: [
        "6281654976901", // Phone number of the first administrator
        "6285175023755"  // Phone number of the second administrator
    ],

    // Whitelist configuration
    whitelist: false, // Set to true to enable whitelist feature
    whitelistSrv: "http://localhost:8080/whitelist", // Servers that provide whitelists
    whitelistMsg: "You are not allowed to use this bot", // Messages to be sent to users when they are not allowed to use bots 
    whitelistUsr: [
        "6285176765422" // Phone number of the whitelisted user
    ]
};
```

### Using MongoDB Sessions
To use MongoDB sessions, please follow these steps:

1. **Install MongoDB session driver**  
    Run the following command to install the MongoDB session driver:
    ```bash
    npm run install:mongo
    ```

2. **Configure MongoDB URL**  
    Add your MongoDB URL to the configuration like this:
    ```js
    sessions: {
        mongodb: "mongodb://username:password@host:port/database?options",
    },
    ```
    **Example:**
    ```js
    sessions: {
        mongodb: "mongodb://myUser:myPassword@localhost:27017/myDatabase?retryWrites=true&w=majority",
    },
    ```

3. **Start the bot**  
    Start the bot with the following command:
    ```bash
    npm start
    ```

### Whitelist

The numbers entered into the whitelist array in the configuration file are permanent until the configuration file is changed. If you want to add a whitelist within a certain period of time, you can use the following command.
```
.whitelist <phone> <duration in days>
```

Example:
```
.whitelist 6285176765422 30
```

In the whitelist configuration, Srv can be filled with a server url that will receive and return json data as follows.

Data to be received by the server.
```json
{
    "user": "6285176765422"
}
```

Data to be returned by the server.
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

## Usage

Run the bot with the command
```bash
node controller.js
```

## Adding Plugins

To add a plugin, please use the following format:

```js
module.exports = {
    admin: false, // Is the plugin administrator-only
    name: 'name', // Added feature names
    alias: ['alias1', 'alias2'], // Other names of the feature can be used as alternative commands
    category: 'test', // Categories of added features
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


## Thanks To
<table>
  <tr>
    <td align="center"><a href="https://github.com/Ismananda"><img src="https://github.com/Ismananda.png?size=100" width="100px;" alt=""/><br /><sub><b>Ismananda</b></sub></a><br /><sub><i>Author of open-wabot</i></sub></td>
    <td align="center"><a href="https://github.com/KilluaBot"><img src="https://github.com/KilluaBot.png?size=100" width="100px;" alt=""/><br /><sub><b>Rusdi Greyrat</b></sub></a><br /><sub><i>General assistant</i></sub></td>
        <td align="center"><a href="https://github.com/WhiskeySockets/Baileys"><img src="https://github.com/WhiskeySockets.png?size=100" width="100px;" alt=""/><br /><sub><b>WhiskeySockets - Baileys</b></sub></a><br /><sub><i>Library used</i></sub></td>
      <td align="center"><a href="https://github.com/adiwajshing"><img src="https://github.com/adiwajshing.png?size=100" width="100px;" alt=""/><br /><sub><b>Adhiraj Singh</b></sub></a><br /><sub><i>Founder baileys</i></sub></td>
      <td align="center"><a href="https://github.com/amiruldev20"><img src="https://github.com/amiruldev20.png?size=100" width="100px;" alt=""/><br /><sub><b>Amirul Dev</b></sub></a><br /><sub><i>Author of mongodb session</i></sub></td>
  </tr>
</table>
