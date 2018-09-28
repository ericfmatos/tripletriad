var dbLogger = require('../db/common/logger');


const LOG_LEVEL = {
    DEBUG: 0,
    INFO: 1,
    WARNING: 2,
    ERROR: 3,
    CRITICAL: 4,
    FATAL: 5
}

function levelToText(level) {
    switch(level) {
        case LOG_LEVEL.DEBUG:
            return 'DEBUG';
        case LOG_LEVEL.INFO:
            return 'INFO';
        case LOG_LEVEL.WARNING:
            return 'WARNING';
        case LOG_LEVEL.ERROR:
            return 'ERROR';
        case LOG_LEVEL.CRITICAL:
            return 'CRITICAL';
        case LOG_LEVEL.FATAL:
            return 'FATAL';
    }
}

module.exports = {



    sendLog: function (data) {
        console.log(`log level ${levelToText( data.level) }: ${data.message}`);


        return dbLogger.logError(data, 
            _err => console.log(_err),
            _data => {} //do nothing
        );
    },

    debug: function(msg, extra) {
        return this.sendLog({level: LOG_LEVEL.DEBUG, message: msg, data: extra});
    },

    info: function(msg, extra) {
        return this.sendLog({level: LOG_LEVEL.INFO, message: msg, data: extra});
    },

    warning: function(msg, extra) {
        return this.sendLog({level: LOG_LEVEL.WARNING, message: msg, data: extra});
    },
    
    error: function(msg, extra) {
        return this.sendLog({level: LOG_LEVEL.ERROR, message: msg, data: extra});
    },

    critical: function(msg, extra) {
        return this.sendLog({level: LOG_LEVEL.CRITICAL, message: msg, data: extra});
    },

    fatal: function(msg, extra) {
        return this.sendLog({level: LOG_LEVEL.FATAL, message: msg, data: extra});
    }

}