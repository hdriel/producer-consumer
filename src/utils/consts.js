const path = require('path');

const consts = {};

// I created my server to handle same behavior as the following API Server: 'http://35.195.195.133:9005'
consts.LOCAL_SERVER = {
    DYNAMIC_SCALE_TASKS: false,
    DYNAMIC_SCALE_TASKS_MIN_SIZE: 5,
    DYNAMIC_SCALE_TASKS_MAX_SIZE: 10,
    TASKS_MIN_SEC: 2,
    TASKS_MAX_SEC: 8,
    PORT: 3000,
    API_END_POINT: `http://localhost:3000`,
    USE_LOCAL_SERVER: false
};

consts.API_END_POINT = consts.LOCAL_SERVER.USE_LOCAL_SERVER
    ? consts.LOCAL_SERVER.API_END_POINT
    : 'http://35.195.195.133:9005';

consts.CONSUMER_SIZE = 2;
consts.RETRY_FAILED = 3;
consts.CONSUMER_INTERVAL = 500;
consts.DEBUG_MODE = true;
consts.LOGGING_MODES = {
    ERROR: 3,
    INFO: 2,
    DEBUG: 1
};
consts.LOGGING_MODE = consts.LOGGING_MODES.INFO;

consts.INPUT_FILE_NAME = path.resolve(__dirname, '../data/inputs.txt');

module.exports = consts