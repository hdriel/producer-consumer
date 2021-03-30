const Queue = require('../utils/queue');
const logger = require('../utils/logger');
const { INPUT_FILE_NAME } = require('../utils/consts');
const fs = require('fs');

const exportData = {
    data: new Queue(),
    doneReadFileStream: false
};

const readStream = fs.createReadStream(INPUT_FILE_NAME);

readStream.on('data', function (chunk) {
    const dataChunk = chunk.toString().split('\n')
        .filter(val => !!val.trim())
        .map(d => +(d.trim()));

    logger.debug(`Reading file stream chunk of number list (size=${dataChunk.length})`);
    dataChunk.forEach(d => exportData.data.enqueue(d));
});

readStream.on('end', () => {
    exportData.doneReadFileStream = true;
})


module.exports = exportData;