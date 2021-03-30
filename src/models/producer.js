const Queue = require('../utils/queue');
const logger = require('../utils/logger');
const Item = require('../utils/item');

/**
 * Singleton
 */
class Producer {
    constructor() {
        if(this.constructor.instance){
            return this.constructor.instance;
        }
        this.constructor.instance = this;

        this.queue = new Queue();
    }

    produce(inputData){
        logger.debug('Produce: ', inputData);
        this.queue.enqueue(new Item({ data: inputData, request_id: null }));
    }

    pull(){
        if(this.queue.isEmpty()){
            return null;
        }
        return this.queue.dequeue();
    }
}

module.exports = Producer;
