const config = require('../config')

module.exports = {
    admin: false,
    name: 'menu',
    alias: ['m'],
    category: 'info',
    run: async (m, plugins) => {
        let text = `*<>=====[ ${config.botName} ]=====<>*\nHi *${m.name}*, here is the list of available features.`;
        let categories = {}

        for (const plugin of plugins) {
            if (typeof plugin.category !== 'string') continue;
            if (!categories[plugin.category]) categories[plugin.category] = [];
            categories[plugin.category].push(plugin.name);
        }

        for (const category of Object.keys(categories).sort()) {
            text += `\n\n*# ${category.replace(/\b\w/g, match => match.toUpperCase())}*`;
            for (const name of categories[category].sort()) {
                text += `\n  ${m.prefix+name}`;
            }
        }

        // to appreciate the developer please don't lose this credit
        text += `\n\n> © 2024 - Open Source WhatsApp Bot\n> https://github.com/Ismananda/open-wabot`;
        m.reply(text)
    }
}