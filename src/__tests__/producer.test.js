const Producer = require('../models/producer');

describe('Test PRODUCER' , function () {
    it('check singleton', () => {
        const producer1 = new Producer();
        const producer2 = new Producer();
        expect(producer1).toBe(producer2);
    });

    it('producer produce and pull', () => {
        const producer = new Producer();
        producer.produce(4);
        expect(producer.queue.isEmpty()).toBeFalsy();

        const item = producer.pull();
        expect(producer.queue.isEmpty()).toBeTruthy();
        expect(item).toHaveProperty('data', 4);
        expect(item).toHaveProperty('request_id', null);
    })
});