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
                    m.reply(format(data));
                } catch (e) {
                    m.reply(format(e));
                }
                break;

            case 'exec':
            case '$':
                if (!m.text) return;
                await m.reply('Executing...');
                exec(m.text, (e, s) => {
                    if (e) m.reply(format(e));
                    if (s) m.reply(format(s));
                });
                break;
        }
    }
}