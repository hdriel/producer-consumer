const Queue = require('../utils/queue');
const { CONSUMER_SIZE, CONSUMER_INTERVAL } = require('../utils/consts');
const request = require('../utils/request');
const Event = require('../utils/event');
const Intervalable = require('../utils/intervalable');
const logger = require('../utils/logger');
const messages = require('../utils/messages');
const AvailableEventArgs = require('../utils/availabelEventArg');

/**
 * Singleton
 * Observer
 */
class Consumer extends Intervalable {
    constructor(size = CONSUMER_SIZE, intervalTime = CONSUMER_INTERVAL, autoInit = true) {
        super(intervalTime);

        if(this.constructor.instance){
            return this.constructor.instance;
        }
        this.constructor.instance = this;

        logger.log('Initialized Consumer');

        this.size = size;
        this.queue = new Queue(size);
        this.availableEvent = new Event()

        if(autoInit){
            this.init(this.handle.bind(this));
        }
    }

    async handle() {
        logger.log('#'.repeat(30));
        logger.log(`Run ${this.constructor.name} handler...`);

        if(this.queue.isEmpty()){
            logger.log(`Free ${this.constructor.name} queue`);
            this.availableEvent.fire(this, new AvailableEventArgs({
                message: messages.FREE_QUEUE(this.constructor.name)
            }));
            logger.log('#'.repeat(30));
            return;
        }
        else if(!this.queue.isFull()){
            logger.log(`There are more places in ${this.constructor.name} queue.`);
            this.availableEvent.fire(this, new AvailableEventArgs({
                message: messages.MORE_SPACE_QUEUE(this.constructor.name)
            }));
        }

        const item = this.queue.dequeue();
        logger.log(`${this.constructor.name} handle item `, JSON.stringify(item));

        try {
            if(!item){
                logger.log(`Release place in ${this.constructor.name} queue`);
                this.availableEvent.fire(this, new AvailableEventArgs({
                    message: messages.INVALID_ITEM_QUEUE(this.constructor.name)
                }));
            }

            else if(!item.request_id){
                const { request_id } = await request.sendRequest(item.inputData);
                item.request_id = request_id;
                logger.log(`${this.constructor.name} send request to server, got request-id: `, item.request_id);

                this.queue.enqueue(item);
            }

            else {
                const result = await request.getResponse(item.request_id);

                if(result){
                    logger.log(`Release place in ${this.constructor.name} queue`);
                    this.availableEvent.fire(this, new AvailableEventArgs({
                        message: messages.DONE_ITEM_QUEUE(),
                        request_id: item.request_id,
                        data: result
                    }));
                }

                else {
                    logger.log(`${this.constructor.name} request id: `, item.request_id, 'is not finished yet');
                    this.queue.enqueue(item);
                }
            }

        }

        catch (e) {
            logger.error(`${this.constructor.name} handler was failed with error: `, e && e.toString());
        }

        finally {
            logger.log('#'.repeat(30));
        }
    }

    consume(item){
        this.queue.enqueue(item);
    }

    clear(){
        this.queue = new Queue(this.size);
        logger.log(`${this.constructor.name} cleared his queue`);
    }
}

module.exports = Consumer;
