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

    let proto = rmsg.message.protocolMessage;
    let msg = proto?.editedMessage || rmsg.message;
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

    if (proto?.editedMessage) {
        msg = getMessage(m.chat.toString(), proto.key.id).message || proto.editedMessage;
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
            msg = msg.message ? msg : { message: ctx.quotedMessage };
            m.quoted.timestamp = msg.messageTimestamp || 0;
            let type = getMessageType(msg.message);
            msg = msg.message[type];
            m.quoted.mimetype = msg.mimetype || 'text/plain';
            m.quoted.text = msg.text || msg.caption || msg;
            m.quoted.url = (m.quoted.text?.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi) || [])[0] || '';
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
            messageId: generateID(24, '0SW4')
        }
        for (let content of contents) {
            switch (true) {
                case (typeof content === 'string'):
                    if (msg.image || msg.video) {
                        msg.caption = content;
                    } else if (msg.audio) {
                        break;
                    } else {
                        msg.text = content;
                    }
                    break;

                case (Buffer.isBuffer(content)):
                    const { fromBuffer } = await import('file-type');
                    const type = await fromBuffer(content);
                    if (type.startsWith('image')) {
                        msg.image = content;
                    } else if (type.startsWith('video')) {
                        msg.video = content;
                    } else if (type.startsWith('audio')) {
                        msg.audio = content;
                        msg.mimetype = 'audio/mpeg';
                    }
                    break;

                case (typeof content === 'object'):
                    break;

                default:
                    break;
            }
        }

        return bot.sendMessage(m.chat.toString(), msg, opt);
    }
    return m;
}

module.exports = { serialize }