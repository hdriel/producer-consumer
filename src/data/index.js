const fs = require('fs');
const path = require('path');

const dataFilePath = path.resolve(__dirname, 'inputs.txt');
const dataStr = fs.readFileSync(dataFilePath, 'utf-8');
const data = dataStr
    .split('\n')
    .filter(val => !!val.trim())
    .map(d => +(d.trim()));

module.exports = data;