const Consumer = require('../models/consumer');

describe('Test CONSUMER' , function () {
    jest.setTimeout(10000);

    it('check singleton', () => {
        const consumer1 = new Consumer(2, 1, true);
        const consumer2 = new Consumer(1, 0, false);
        expect(consumer1).toBe(consumer2);
        expect(consumer2.queue.size).toBe(2);
    });

    it('consumer consume item', () => {
        const consumer = new Consumer(1, 0, false);
        consumer.consume({inputData: 5, request_id: null});
        expect(consumer.queue.isEmpty()).toBeFalsy();

        consumer.clear();
        expect(consumer.queue.isEmpty()).toBeTruthy();
    });

    it('consumer notify on empty queue', (done) => {
        const consumer = new Consumer(1, 1, true);

        consumer.availableEvent.subscribe((sender, args) => {
            expect(true).toBeTruthy();
            done();
        });
    });

    it('consumer notify on free space but not empty queue', (done) => {
        const consumer = new Consumer(2, 1, true);
        consumer.consume({inputData: 1, request_id: '123'});
        consumer.availableEvent.subscribe((sender, args) => {
            expect(true).toBeTruthy();
            consumer.clear();
            done();
        });
    })
});