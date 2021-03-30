class Queue {
    constructor(size) {
        this.elements = [];
        this.size = size;
    }

    enqueue(e) {
        if(this.size && this._length() + 1 > this.size){
            throw `Try to push maximum ${this.constructor.name} queue size (${this.size})`;
        }

        this.elements.push(e)
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this._length() === 0;
    }

    isFull() {
        return this.size && this._length() === this.size;
    }

    _length() {
        return this.elements.length;
    }
}

module.exports = Queue;