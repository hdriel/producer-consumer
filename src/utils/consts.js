const path = require('path');

const consts = {};

consts.API_END_POINT = 'http://35.195.195.133:9005';
consts.CONSUMER_SIZE = 2;
consts.CONSUMER_INTERVAL = 1000;
consts.DEBUG_MODE = true;
consts.LOGGING_MODES = {
    ERROR: 3,
    INFO: 2,
    DEBUG: 1
};
consts.LOGGING_MODE = consts.LOGGING_MODES.INFO;

consts.INPUT_FILE_NAME = path.resolve(__dirname, '../data/inputs.txt');

module.exports = consts