class Queue {
    constructor(size = 0) {
        this.elements = [];
        this.size = size;
    }

    enqueue(e) {
        if(this.size && this.length() + 1 > this.size){
            throw `Try to push maximum ${this.constructor.name} queue size (${this.size})`;
        }

        this.elements.push(e)
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this.length() === 0;
    }

    isFull() {
        return this.size && this.length() >= this.size;
    }

    length() {
        return this.elements.length;
    }

    resize(size){
        this.size = size;
    }

    incSize(){
        if(this.size){
            this.size++;
        }
    }

    isLimitedQueue(){
        return !!this.size;
    }
}

module.exports = Queue;