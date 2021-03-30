const data = require('./data');
const logger = require('./utils/logger');
const Producer = require('./models/producer');
const Consumer = require('./models/consumer');

(async () => {
    const producer = new Producer();
    const consumer = new Consumer();

    // Fill producer queue
    data.forEach(inputData => producer.produce(inputData));

    // Define Consumer
    consumer.availableEvent.subscribe((sender, args) => {
        const item = producer.pull();
        if(item){
            logger.log(sender.constructor.name, ' Consume more item: ', JSON.stringify(item));
            sender.consume(item);
        }
        else if(sender.queue.isEmpty()){
            logger.log('');
            logger.log('*'.repeat(39))
            logger.log('* !!! DONE HANDLER ALL DATA ITEMS !!! *');
            logger.log('*'.repeat(39))
            process.exit(0);
        }
    });
})()