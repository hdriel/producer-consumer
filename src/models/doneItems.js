const Queue = require('../utils/queue');

class DoneItems {
    constructor() {
        if(this.constructor.instance){
            return this.constructor.instance;
        }
        this.constructor.instance = this;

        this.queue = new Queue();
    }

    enqueue(item){
        this.queue.enqueue(item);
    }

    toString(){
        return JSON.stringify(
            this.queue.elements.map(d => JSON.stringify(d)),
            null,
            4
        );
    }
}

module.exports = new DoneItems();
