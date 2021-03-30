const messages = {};
messages.FREE_QUEUE = queueName => `Empty ${queueName} queue`;
messages.MORE_SPACE_QUEUE = queueName => `More space in ${queueName} queue`;
messages.INVALID_ITEM_QUEUE = queueName => `Invalid item was remove from ${queueName} queue`;
messages.DONE_ITEM_QUEUE = queueName => `Finished to handler item`;

module.exports = messages;