const Queue = require('../utils/queue');

describe('Test QUEUE' , function () {
    it('check queue enqueue', () => {
        const queue = new Queue();
        const list = new Array(10).fill('').map((_, i) => i);
        list.forEach(i => queue.enqueue(i));
        expect(queue.elements).toEqual(list);
    });

    it('check queue dequeue', () => {
        const queue = new Queue();
        const list = new Array(5).fill('').map((_, i) => i);
        list.forEach(i => queue.enqueue(i));
        queue.dequeue();
        queue.dequeue();
        expect(queue.elements).toEqual([2,3,4]);
    });

    it('check queue isEmpty', () => {
        const queue = new Queue();
        expect(queue.isEmpty()).toBeTruthy();
    });

    it('check queue isFull', () => {
        const queue = new Queue();
        expect(queue.isFull()).toBeFalsy();
        const list = new Array(Math.ceil(Math.random() * 100)).fill('').map((_, i) => i);
        list.forEach(i => queue.enqueue(i));
        expect(queue.isFull()).toBeFalsy();
    });
});

describe('Test Limited QUEUE' , function () {
    it('check queue enqueue', () => {
        const queue = new Queue(3);
        const list = new Array(3).fill('').map((_, i) => i);
        list.forEach(i => queue.enqueue(i));
        expect(queue.elements).toEqual(list);
    });

    it('check queue dequeue', () => {
        const queue = new Queue(5);
        const list = new Array(5).fill('').map((_, i) => i);
        list.forEach(i => queue.enqueue(i));
        queue.dequeue();
        queue.dequeue();
        expect(queue.elements).toEqual([2,3,4]);
    });

    it('check queue isEmpty', () => {
        const queue = new Queue(10);
        expect(queue.isEmpty()).toBeTruthy();
    });

    it('check queue isFull', () => {
        const queue = new Queue(10);
        expect(queue.isFull()).toBeFalsy();

        const list = new Array(Math.ceil(10)).fill('').map((_, i) => i);
        list.forEach(i => queue.enqueue(i));
        expect(queue.isFull()).toBeTruthy();

        queue.dequeue();
        expect(queue.isFull()).toBeFalsy();
    });
});