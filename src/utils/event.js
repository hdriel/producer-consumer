class Event {
    constructor() {
        this.handlers = new Map();
        this.count = 0;
    }

    subscribe(handler) {
        this.handlers.set(++this.count, handler);
        return this.count;
    }

    unsubscribe(idx) {
        this.handlers.delete(idx);
    }

    /**
     * @param sender - who fired the event?
     * @param args - arguments to handle from subscribe
     */
    fire(sender, args) {
        this.handlers.forEach(
            handler => handler(sender, args)
        );
    }
}

module.exports = Event;
