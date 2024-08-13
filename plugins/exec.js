const { exec } = require('child_process');
const { format } = require('util');

module.exports = {
    admin: true,
    name: 'exec',
    alias: ['>', '$'],
    category: 'administrator',
    run: async (m, plugins) => {
        let data;
        switch (m.cmd){
            case '>':
                try {
                    if (!m.text) return;
                    data = m.text.includes('return') 
                        ? await eval(`(async () => { ${m.text} })()`)
                        : await eval(`(async () => { return ${m.text} })()`);
                    await m.reply(format(data));
                } catch (e) {
                    await m.reply(format(e));
                }
                break;

            case 'exec':
            case '$':
                if (!m.text) return;
                await m.reply('Executing...');
                exec(m.text, async (e, s) => {
                    if (e) await m.reply(format(e));
                    if (s) await m.reply(format(s));
                });
                break;
        }
    }
}