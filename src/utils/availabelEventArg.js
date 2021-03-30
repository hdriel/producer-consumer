class AvailableEventArgs {
    constructor({message, request_id, data}) {
        this.message = message;
        this.request_id = request_id;
        this.data = data;
    }
}

module.exports = AvailableEventArgs;