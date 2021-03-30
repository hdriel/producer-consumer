const { DEBUG_MODE } = require('./consts');

module.exports.log = function (...args) {
    if(DEBUG_MODE){
        console.log(...args);
    }
}

module.exports.debug = function (...args) {
    if(DEBUG_MODE){
        console.debug(...args);
    }
}

module.exports.error = function (...args) {
    console.error(...args);
}