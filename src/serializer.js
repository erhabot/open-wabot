const { downloadMediaMessage } = require('baileys');
const { getMessage } = require('./store.js');
const { generateID } = require('./util.js')
const config = require('../config');

let recentId = {};
let userName = {};

function getMessageType(content) {
    if (!content) return '';
    return Object.keys(content).find(k => !/^(senderKeyDistributionMessage|messageContextInfo)$/.test(k)) || ''
}

function parseMention(text) {
    if (typeof text === 'string') {
       let matches = text.matchAll(/@([0-9]{5,16}|0)/g);
       if (matches !== null) {
          return [...matches].map(v => v[1] + '@s.whatsapp.net') || [];
       }
    }
    return [];
 } 

/**
 * Serializes a message object to extract relevant details.
 *
 * This function processes incoming messages to create a serialized object 
 * with key information. It ensures that each message is processed only once 
 * by tracking recently processed message IDs. It also handles message types,
 * quoted messages, and media downloads.
 * @param {Object} rmsg - The message object received from Baileys.
 * @returns {Object|undefined} - A serialized message object or undefined if the message should be ignored.
 */
function serialize(rmsg) {
    if (!rmsg.message || !rmsg.key || rmsg.status === 1) return;
    if (recentId[rmsg.key.sender] === rmsg.key.id) return;
    recentId[rmsg.key.sender] = rmsg.key.id

    let m = {
        id: rmsg.key.id,
        name: rmsg.key.fromMe ? bot.user.name : rmsg.pushName,
        chat: bot.decodeJID(rmsg.key.remoteJid),
        sender: bot.decodeJID(rmsg.key.fromMe ? bot.user.id : rmsg.key.participant || rmsg.key.remoteJid),
        fromMe: rmsg.key.fromMe,
        broadcast: rmsg.broadcast,
        timestamp: rmsg.messageTimestamp?.low || rmsg.messageTimestamp?.high || rmsg.messageTimestamp || Math.floor(Date.now() / 1000)
    }

    userName[m.sender.toString()] = m.name;

    m.isGroup = m.chat.server === 'g.us';
    if (m.isGroup) {
        // TODO: Implement functionality to read group metadata
    }

    let edited = rmsg.message.editedMessage?.message?.protocolMessage;
    let msg = edited?.editedMessage || rmsg.message;
    m.type = getMessageType(msg);
    msg = m.type == 'conversation' ? msg : msg[m.type];
    if (!msg) return;

    m.body = msg.conversation || msg.text || msg.caption;
    if (m.body) {
        m.prefix = config.prefixes.find(p => m.body.startsWith(p));
        let body = m.body.slice(m.prefix?.length).trim();
        m.cmd = body.split(/[\s\n]+/)[0].toLowerCase();
        m.text = body.slice(m.cmd.length).trim();
        m.url = (body.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi) || [])[0] || '';
    }

    if (edited?.editedMessage) {
        msg = getMessage(m.chat.toString(), edited.key.id).message || edited.editedMessage;
        msg = msg[getMessageType(msg)];
    }

    m.mimetype = msg.mimetype || 'text/plain';
    if (msg.mimetype || msg.thumbnailDirectPath) {
        m.download = function download() { return downloadMediaMessage({ rmsg }, 'buffer', { reuploadRequest: bot.updateMediaMessage })};
    }

    m.message = rmsg.message
    let ctx = msg.contextInfo;
    if (ctx) {
        m.expiration = ctx.expiration || 0;
        if (ctx.quotedMessage) {
            m.contextInfo = ctx;
            m.quoted = {
                key: {
                    id: ctx.stanzaId,
                    remoteJid: ctx.remoteJid || m.chat.toString(),
                    participant: ctx.participant
                },
                pushName: userName[ctx.participant]
            };
            msg = getMessage(m.quoted.key.remoteJid, ctx.stanzaId);
            console.log(msg)
            msg = msg.message ? msg : { message: ctx.quotedMessage };
            m.quoted.timestamp = msg.messageTimestamp || 0;
            let type = getMessageType(msg.message);
            msg = msg.message[type];
            m.quoted.mimetype = msg.mimetype || 'text/plain';
            m.quoted.text = typeof msg === 'string' ? msg : msg.text || msg.caption || '';
            m.quoted.url = (m.quoted.text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi) || [])[0] || '';
            m.quoted[type] = msg;
            if (msg.mimetype || msg.thumbnailDirectPath) {
                m.quoted.download = function download() { return downloadMediaMessage({ message: m.quoted }, 'buffer', { reuploadRequest: bot.updateMediaMessage }); };
            }
        }
    }

    m.reply = async function reply(...contents) {
        let msg = {}
        let opt = {
            quoted: rmsg,
            getUrlInfo: false,
            ephemeralExpiration: m.expiration,
            messageId: generateID(24, '0SW8')
        }
        for (let content of contents) {
            switch (true) {
                case (typeof content === 'string'):
                    let mentions = parseMention(content);
                    if (mentions) {
                        msg.mentions = mentions
                    }

                    if (msg.image || msg.video || msg.document) {
                        if (msg.text) {
                            msg.caption += ' ' + content
                        } else {
                            msg.caption = content;
                        }
                    } else if (!msg.audio && !msg.sticker) {
                        if (msg.text) {
                            msg.text += ' ' + content
                        } else {
                            msg.text = content;
                        }
                    }
                    break;

                case (Buffer.isBuffer(content)):
                    const { fileTypeFromBuffer } = await import('file-type');
                    const { mime, ext } = await fileTypeFromBuffer(content);
                    if (msg.text) {
                        msg.caption = msg.text;
                        delete msg.text;
                    }

                    if (mime === 'image/webp') {
                        delete msg.caption;
                        msg.sticker = content;
                    } else if (mime.startsWith('image')) {
                        msg.image = content;
                    } else if (mime.startsWith('video')) {
                        msg.video = content;
                    } else if (mime.startsWith('audio')) {
                        msg.audio = content;
                        msg.mimetype = 'audio/mpeg';
                    } else {
                        msg.mimetype = mime;
                        msg.document = content;
                        msg.fileName = `${ generateID(12, 'OWB_') }.${ext}`;
                    }
                    break;

                case (typeof content === 'object'):
                    Object.assign(opt, content)
                    break;

                default:
                    throw new Error('unsupported typedata');
            }
        }

        return bot.sendMessage(m.chat.toString(), msg, opt);
    }
    return m;
}

module.exports = { serialize }