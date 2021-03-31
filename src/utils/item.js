class Item {
    constructor({request_id, data}) {
        this.request_id = request_id;
        this.data = data;
        this._index = undefined;
    }

    set index(i){
        this._index = i;
    }
}

module.exports = Item;