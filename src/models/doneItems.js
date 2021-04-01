const Queue = require('../utils/queue');
const fs = require('fs');
const { OUTPUT_FILE_NAME, WRITE_OUTPUT_TO_FILE_INTERVAL} = require('../utils/consts');
const Intervalable = require('../utils/intervalable');

class DoneItems extends Intervalable{
    constructor() {
        super(WRITE_OUTPUT_TO_FILE_INTERVAL)
        if(this.constructor.instance){
            return this.constructor.instance;
        }
        this.constructor.instance = this;

        this.queue = new Queue();

        // Clear output file
        fs.writeFileSync(OUTPUT_FILE_NAME, '');

        this.handlerInProgress = false;
        this.init(this.handleItems.bind(this));
    }

    enqueue(item){
        this.queue.enqueue(item);
    }

    handleItems(){
        if(this.handlerInProgress){
            return;
        }

        this.handlerInProgress = true;

        while (!this.queue.isEmpty()){

            const item = this.queue.dequeue();
            const str = JSON.stringify(item)
                .replace(/\\"/gmi, '')
                .replace(/,/gmi, ', ')
                .replace(/"{/gmi, '{ ')
                .replace(/}"/gmi, ' }')
            + '\n';

            fs.appendFileSync(OUTPUT_FILE_NAME, str);
        }

        this.handlerInProgress = false;
    }
}

module.exports = new DoneItems();
