const fs = require('fs');
const config = require('../config');
let whitelist = {};

/**
 * Adds a user to the whitelist with an expiration timestamp.
 *
 * This function adds a user to the whitelist and sets an expiration timestamp.
 * It then saves the updated whitelist to a JSON file.
 *
 * @param {string} user - The user to be added to the whitelist.
 * @param {number} expiration - The expiration timestamp for the whitelist entry (UNIX timestamp in milliseconds).
 */
function addWhitelist(user, expiration) {
    whitelist[user] = expiration;
    fs.writeFileSync('../data/whitelist.json', JSON.stringify(whitelist, null, 2), 'utf8');
}

/**
 * Checks if a user is whitelisted.
 *
 * This function checks if a given user is in the whitelist and if their
 * whitelisting has not expired. If whitelisting is disabled in the configuration,
 * it always returns true. It checks both the configuration's whitelist and the
 * dynamically loaded whitelist.
 *
 * @param {string} user - The user to check.
 * @returns {boolean} - Returns true if the user is whitelisted and not expired, false otherwise.
 */
function isWhitelist(user) {
    if (!config.whitelist) return true;
    if (config.administrator.find(x => x == user)) return true;
    if (config.whitelistUsr.find(x => x == user)) return true;

    let expTimestamp = whitelist[user];
    return (expTimestamp && expTimestamp > Date.now());
}

// Load the whitelist if whitelisting is enabled in the configuration
if (config.whitelist && fs.existsSync('../data/whitelist.json')) {
    Object.assign(whitelist, JSON.parse(fs.readFileSync('../data/whitelist.json')));
}

module.exports = {
    isWhitelist,
    addWhitelist
}