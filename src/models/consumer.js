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

        this.queue = new Queue();
        this.availableEvent = new Event()
        this.reFireAvailableEvent = false;

        if(autoInit){
            this.init(this.handle.bind(this));
        }
    }

    _queueStatusHandler(){
        logger.log(`Current ${this.constructor.name} queue items: ${this.queue.length()} / ${this.queue.size || 'Infinity'}`);
        if(this.queue.isEmpty()){
            logger.log(`Free ${this.constructor.name} queue`);
            this.availableEvent.fire(this, new AvailableEventArgs({
                message: messages.FREE_QUEUE(this.constructor.name)
            }));
            logger.log('#'.repeat(80));

            return true;
        }
        else if(!this.queue.isLimitedQueue() || this.reFireAvailableEvent || !this.queue.isFull()){
            logger.log(`There are more places in ${this.constructor.name} queue.`);
            this.availableEvent.fire(this, new AvailableEventArgs({
                message: messages.MORE_SPACE_QUEUE(this.constructor.name)
            }));
        }
    }

    _invalidItemHandler(item){
        if(!item){
            logger.debug(`ITEM IS INVALID`);

            logger.log(`Release place in ${this.constructor.name} queue`);
            this.availableEvent.fire(this, new AvailableEventArgs({
                message: messages.INVALID_ITEM_QUEUE(this.constructor.name)
            }));
        }
    }

    async _unhandledItemHandler(item, returnedToQueue){
        if(item && !item.request_id){
            logger.debug(`ITEM IS UNHANDLED STATE - SEND REQUEST FOR ASKING REQUEST_ID`);

            const response = await request.sendRequest(item.data);
            const isWasLimitedQueue = this.queue.isLimitedQueue();

            // When response is null - we got status code 403 from cooperate server that mean the server is full requested
            if(!response) {
                const size = this.queue.length(); // Pin queue size (turn queue to limited)
                this.queue.resize(size);

                if(!isWasLimitedQueue){
                    logger.log(`Resize the ${this.constructor.name} queue size to ${size}`)
                }
            }
            else {
                item.request_id = response.request_id;

                this.queue.resize(0); // Unpin queue size (turn queue to unlimited)
                if(isWasLimitedQueue){
                    logger.log(`Resize the ${this.constructor.name} queue size to Infinity`);
                }

                logger.log(`${this.constructor.name} send request and got request_id: '${item.request_id}'`);
                this.availableEvent.fire(this, new AvailableEventArgs({
                    message: messages.MORE_SPACE_QUEUE(this.constructor.name),
                }));
            }

            if(!returnedToQueue){
                this.queue.enqueue(item);
                return true;
            }
        }
        return false;
    }

    async _handledItemHandler(item, returnedToQueue){
        if(item && item.request_id){
            logger.debug(`ITEM IS HANDLED STATE - SEND REQUEST FOR ASKING RESULT TO HIS REQUEST_ID`);

            const result = await request.getResponse(item.request_id);

            // Then result is null it's mean the server hasn't finished the request_id task yet, so re-enqueue to try in next loop
            if(result){
                logger.log(`Release place in ${this.constructor.name} queue, {${item.request_id}: ${item.result}`);
                this.availableEvent.fire(this, new AvailableEventArgs({
                    message: messages.DONE_ITEM_QUEUE(),
                    request_id: item.request_id,
                    data: result
                }));
            }
            else {
                logger.log(`${this.constructor.name} request id: `, item.request_id, 'is not finished yet');
                if(!returnedToQueue){
                    this.queue.enqueue(item);
                    return true;
                }
            }
        }
        return false;
    }

    async handle() {
        logger.log('#'.repeat(80));
        logger.log(`Run ${this.constructor.name} handler...`);

        const isFinishedHandler = this._queueStatusHandler();
        if(isFinishedHandler){
            return;
        }

        const item = this.queue.dequeue();
        logger.log(`${this.constructor.name} handle item\n`, JSON.stringify(item, null, 4));

        try {
            let returnedToQueue = false;
            this._invalidItemHandler(item);
            returnedToQueue = await this._unhandledItemHandler(item, returnedToQueue);
            returnedToQueue = await this._handledItemHandler(item, returnedToQueue);
        }
        catch (e) {
            const itemDescription = item
                ? (item.request_id && `request_id: '${item.request_id}'`) || item.data && `data: '${item.data}'`
                : this.constructor.name;

            logger.error(`${itemDescription} item handler was failed with error: `, e && e.toString());
        }
        finally {
            logger.log('#'.repeat(80));
        }
    }

    consume(item){
        item.index = this.queue.length();
        this.queue.enqueue(item);
    }

    clear(){
        this.queue = new Queue(this.size);
        logger.log(`${this.constructor.name} cleared his queue`);
    }
}

module.exports = Consumer;
