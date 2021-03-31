const inputData = require('./data');
const logger = require('./utils/logger');
const Producer = require('./models/producer');
const Consumer = require('./models/consumer');
const doneItems = require('./models/doneItems');

(async () => {
    const producer = new Producer();
    const consumer = new Consumer();

    let doneReadFile = false;
    // Loading data from file stream and fill producer queue
    const readingFileStreamIntervalId = setInterval(() => {
        if(!inputData.data.isEmpty()) producer.produce(inputData.data.dequeue());

        doneReadFile = inputData.doneReadFileStream && inputData.data.isEmpty();
        if(doneReadFile) {
            logger.log('Finished to read input data file stream.');
            clearInterval(readingFileStreamIntervalId);
        }
    }, 0);

    // Consumer subscribe event handler for available place in consumer queue.
    consumer.availableEvent.subscribe(async (sender, args) => {
        sender.queue.incSize();
        const item = producer.pull();

        if(item){
            sender.reFireAvailableEvent = false;
            logger.debug(sender.constructor.name, ' Consume more item: ', JSON.stringify(item));
            await sender.consume(item).catch(err => {
                logger.error(err);
                producer.produce(item.data);
            });
        }
        else{
            // If consumer not consume any item, steel there are more space to the next loop
            sender.reFireAvailableEvent = true;
        }

        // Handle checking ending program
        const isFinishedProgram = (
            doneReadFile &&
            producer.queue.isEmpty() &&
            consumer.queue.isEmpty()
        );
        if(isFinishedProgram){
            logger.log('');
            logger.log('*'.repeat(39))
            logger.log('* !!! DONE HANDLER ALL DATA ITEMS !!! *');
            logger.log('*'.repeat(39))
            logger.log('DONE ITEMS');
            logger.log(doneItems.toString());
            process.exit(0);
        }
    });
})();
