const { RETRY_FAILED } = require('./consts');

class Item {
    constructor({request_id, data}) {
        this.request_id = request_id;
        this.data = data;
        this.retry = RETRY_FAILED
        this.index = undefined;
    }
}

module.exports = Item;