const { DEBUG_MODE, LOGGING_MODE, LOGGING_MODES } = require('./consts');

module.exports.log = function (...args) {
    if(DEBUG_MODE && LOGGING_MODE <= LOGGING_MODES.INFO){
        console.log(...args);
    }
}

module.exports.debug = function (...args) {
    if(DEBUG_MODE && LOGGING_MODE <= LOGGING_MODES.DEBUG){
        console.debug(...args);
    }
}

module.exports.error = function (...args) {
    if(DEBUG_MODE && LOGGING_MODE <= LOGGING_MODES.ERROR){
        console.error(...args);
    }
}