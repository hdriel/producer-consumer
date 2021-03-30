const logger = require('./logger');

class Intervalable {
    constructor(intervalTime) {
        this.intervalId = null;
        this.intervalTime = intervalTime;
    }

    stop(){
        if(this.intervalId){
            logger.log(`Stop ${this.constructor.name} interval id`, this.intervalId);
            clearInterval(this.intervalId);
        }
    }

    init(cb) {
        if(this.intervalId){
            this.stop();
        }

        this.intervalId = setInterval(() => cb(), this.intervalTime);

        logger.log(`Started ${this.constructor.name} interval id`, this.intervalId._idleStart);
    }
}

module.exports = Intervalable;