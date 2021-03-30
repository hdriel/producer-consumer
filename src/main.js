const inputData = require('./data');
const logger = require('./utils/logger');
const Producer = require('./models/producer');
const Consumer = require('./models/consumer');

(async () => {
    const producer = new Producer();
    const consumer = new Consumer();

    // Loading data from file stream and fill producer queue
    const readingFileStreamIntervalId = setInterval(() => {
        if(!inputData.data.isEmpty()) producer.produce(inputData.data.dequeue());
        if(inputData.doneReadFileStream) {
            logger.log('Finished to read input data file stream.');
            clearInterval(readingFileStreamIntervalId);
        }
    }, 500);

    // Consumer subscribe event handler for available place in consumer queue.
    consumer.availableEvent.subscribe((sender, args) => {
        const item = producer.pull();
        if(item){
            logger.log(sender.constructor.name, ' Consume more item: ', JSON.stringify(item));
            sender.consume(item);
        }

        // Handle checking ending program
        const isFinishedProgram = (
            inputData.doneReadFileStream &&
            inputData.data.isEmpty() &&
            producer.queue.isEmpty() &&
            sender.queue.isEmpty()
        );
        if(isFinishedProgram){
            logger.log('');
            logger.log('*'.repeat(39))
            logger.log('* !!! DONE HANDLER ALL DATA ITEMS !!! *');
            logger.log('*'.repeat(39))
            process.exit(0);
        }
    });
})();
