const { randomBytes } = require('crypto');
const path = require('path');
const fs = require('fs');

// Function to delay execution for a specified number of milliseconds
global.delay = int => new Promise(resolve => setTimeout(resolve, int));

/**
 * Generates a random ID of the specified length.
 * @param {number} [length=32] - The length of the ID to generate.
 * @param {string} [id=''] - The initial value of the ID.
 * @returns {string} - The generated ID in uppercase.
 */
function generateID(length = 32, id = '') {
    id += randomBytes(Math.floor((length - id.length) / 2)).toString('hex');
    while (id.length < length) id += '0';
    return id.toUpperCase();
}

/**
 * Serializes an object to a JSON string, converting `undefined` values to a specific string representation.
 *
 * This function uses `JSON.stringify` with a custom replacer function to handle `undefined` values.
 * Instead of omitting `undefined` values (as is the default behavior of `JSON.stringify`), 
 * this function converts them to the string `'undefined'` for visibility in the resulting JSON string.
 *
 * @param {Object} obj - The object to be serialized to a JSON string.
 * @returns {string} - A JSON string representation of the object, with `undefined` values converted to `'undefined'`.
 */
function stringify(obj) {
    return JSON.stringify(obj, (key, value) => value === undefined ? null : value, 2);
}


/**
 * Recursively scans a directory and returns a list of all files.
 * @param {string} dir - The directory to scan.
 * @param {string[]} [list=[]] - The list of files found.
 * @returns {string[]} - The list of files.
 */
function scanDir(dir, list = []) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const files = fs.readdirSync(dir);

    for (let file of files) {
        file = path.resolve(dir, file);
        let stat = fs.statSync(file);
        stat.isDirectory() ? scanDir(file, list) : list.push(file);
    }
    return list;
}

module.exports = {
    generateID,
    stringify,
    scanDir
};