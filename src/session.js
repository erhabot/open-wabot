const pino = require('pino');
const path = require('path');
const { rmSync } = require('fs');
const pretty = require('pino-pretty');
const { isModuleInstalled } = require('./util.js');
const { debug, sessions } = require('../config.js');

let loadAuthState;

// Initialize logging with pino and pino-pretty
const log = global.log || pino(pretty({
    colorize: true,
    minimumLevel: debug ? 'trace' : 'info',
    sync: true,
}));

// Check if 'baileys-mongodb' is installed and sessions.mongodb is configured
if (isModuleInstalled('baileys-mongodb') && sessions?.mongodb) {
    // Use MongoDB for session management
    loadAuthState = async function loadAuthState() {
        log.info("Using MongoDB session");
        const { useMongoAuthState } = require('baileys-mongodb');
        return await useMongoAuthState(sessions.mongodb, {});
    };
} else {
    // Use local file system for session management
    const sessionDir = path.join(__dirname, '..', 'data', 'session');
    loadAuthState = async function loadAuthState() {
        log.info("Using local session");
        const { useMultiFileAuthState } = require('baileys');
        const session = await useMultiFileAuthState(sessionDir);
        // Add removeCreds function to session to delete session directory
        session.removeCreds = async () => {
            rmSync(sessionDir, { recursive: true, force: true });
        };
        return session;
    };
}

// If this file is run directly, remove the session credentials
if (require.main === module) {
    (async () => {
        try {
            const session = await loadAuthState();
            log.warn('Removing session');
            await session.removeCreds();
            log.info('Success');
            process.exit(); // make sure the application is closed
        } catch (err) {
            log.error(err);
        }
    })();
}

module.exports = {
    loadAuthState
};