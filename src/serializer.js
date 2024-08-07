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
function isUrl(text) {
        const regex = new RegExp(/((http|https|ftp):\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi');
        const matches = text?.match(regex) || [];
        return matches.length > 0 ? matches : false;
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
            console.log(msg)
            msg = msg.message ? msg : { message: ctx.quotedMessage };
            m.quoted.timestamp = msg.messageTimestamp || 0;
            let type = getMessageType(msg.message);
            msg = msg.message[type];
            m.quoted.mimetype = msg.mimetype || 'text/plain';
            m.quoted.text = typeof msg === 'string' ? msg : msg.text || msg.caption || '';
            console.log('\n---------------------------------')
            console.log(msg.text)
            console.log(m.quoted)
            m.quoted.url = (m.quoted.text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi) || [])[0] || '';
            m.quoted[type] = msg;
            if (msg.mimetype || msg.thumbnailDirectPath) {
                m.quoted.download = function download() { return downloadMediaMessage({ message: m.quoted }, 'buffer', { reuploadRequest: bot.updateMediaMessage }); };
            }
        }
    }
    m.reply = async function reply(...args) {
        let buffer, text, options, contents;
      
        if (args.length === 1) {
          // Case: m.reply("text")
          if (typeof args[0] === 'string') {
            text = args[0];
            return bot.sendMessage(m.chat.toString(), { text });
          } else {
            // Case: m.reply({...options, ...contents})
            contents = args[0];
            options = contents;
            return bot.sendMessage(m.chat.toString(), options);
          }
        } else if (args.length === 2) {
          // Case: m.reply(buffer, "string")
          if (Buffer.isBuffer(args[0])) {
            buffer = args[0];
            text = args[1];
            const { fileTypeFromBuffer } = await import('file-type');
            const type = await fileTypeFromBuffer(buffer);
            if (type.mime.startsWith('image')) {
              return bot.sendMessage(m.chat.toString(), { image: buffer, caption: text });
            } else if (type.mime.startsWith('video')) {
              return bot.sendMessage(m.chat.toString(), { video: buffer, caption: text });
            } else if (type.mime.startsWith('audio')) {
              return bot.sendMessage(m.chat.toString(), { audio: buffer, mimetype: type.mime, caption: text });
            }
          } else {
            // Case: m.reply({...options, ...contents}, "string")
            contents = args[0];
            options = contents;
            text = args[1];
            return bot.sendMessage(m.chat.toString(), { ...options, caption: text });
          }
        } else if (args.length === 3) {
          // Case: m.reply(buffer, "string", {...options, ...contents})
          buffer = args[0];
          text = args[1];
          contents = args[2];
          options = contents;
          const { fileTypeFromBuffer } = await import('file-type');
          const type = await fileTypeFromBuffer(buffer);
          if (type.mime.startsWith('image')) {
            return bot.sendMessage(m.chat.toString(), { ...options, image: buffer, caption: text });
          } else if (type.mime.startsWith('video')) {
            return bot.sendMessage(m.chat.toString(), { ...options, video: buffer, caption: text });
          } else if (type.mime.startsWith('audio')) {
            return bot.sendMessage(m.chat.toString(), { ...options, audio: buffer, mimetype: type.mime, caption: text });
          }
        }
      
        let msg = {
          mentions: [m.sender.toString(), ...parseMention(text || '')]
        };
      
        if (buffer) {
          const { fileTypeFromBuffer } = await import('file-type');
          const type = await fileTypeFromBuffer(buffer);
          if (type.mime.startsWith('image')) {
            msg.image = buffer;
          } else if (type.mime.startsWith('video')) {
            msg.video = buffer;
          } else if (type.mime.startsWith('audio')) {
            msg.audio = buffer;
            msg.mimetype = type.mime;
          }
        }
      
        if (text) {
          if (args.length === 1) {
            msg.text = text;
          } else {
            if (msg.image || msg.video || (options && options.contents)) {
              msg.caption = text;
            } else {
              msg.text = text;
            }
          }
        }
      
        if (contents) {
            
          Object.assign(msg, contents);
        }
      
        options = {
          ...options,
          quoted: rmsg,
          getUrlInfo: false,
          ephemeralExpiration: m.expiration,
          messageId: generateID(24, '0SW4'),
          ...msg
        };
      
        return bot.sendMessage(m.chat.toString(), buffer || msg, options);
      };

    return m;
    
}

module.exports = { serialize }
