const expired = 3600; // Time in seconds before messages expire
let messages = {};

/**
 * Retrieves a message from the messages store.
 *
 * This function looks up a message by its ID for a specific user and returns
 * the message if it exists and has not expired. Messages are filtered based
 * on their timestamp to ensure only non-expired messages are considered.
 *
 * @param {string} user - The user identifier (chat ID) for which the message is to be retrieved.
 * @param {string} id - The unique identifier of the message to retrieve.
 * @returns {Object} - The message object if found and not expired, or an empty object if not found or expired.
 */
function getMessage(user, id) {
    const time = Date.now() / 1000; // Current time in seconds
    // Filter out expired messages based on the timestamp
    messages[user] = messages[user]?.filter((item) => time - item.timestamp <= expired) || [];
    // Find and return the message with the specified ID, or return an empty object if not found
    return messages[user].find(item => item.key.id == id) || {};
}

/**
 * Saves a message to the messages store.
 *
 * This function saves a new message to the store and ensures that only messages
 * that have not expired are kept. If the message has a protocol message or is empty,
 * it will be ignored. The message timestamp is set or updated based on its properties.
 *
 * @param {Object} msg - The message object to be saved.
 */
function saveMessage(msg) {
    const id = msg.key.remoteJid; // Chat ID for the message
    if (!msg.message || msg.message.protocolMessage) return; // Ignore empty or protocol messages

    // Set or update the message timestamp
    msg.timestamp = msg.messageTimestamp?.low || msg.messageTimestamp?.high || msg.messageTimestamp || Math.floor(Date.now() / 1000);

    // Add message to the store or initialize the list if not present
    messages[id] = messages[id] || [];
    messages[id].push(msg);

    // Filter out expired messages based on the timestamp
    const time = Date.now() / 1000; // Current time in seconds
    messages[id] = messages[id].filter((item) => time - item.timestamp <= expired);
}

module.exports = {
    getMessage,
    saveMessage
}