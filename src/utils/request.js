const axios = require('axios');
const { API_END_POINT } = require('./consts');
const logger = require('./logger');

/**
 * Singleton
 */
class Request {
    constructor(api) {
        if(this.constructor.instance){
            return this.constructor.instance;
        }
        this.constructor.instance = this;

        this.url = api;
    }

    async sendRequest(number){
        logger.debug(`sending request to "POST:${this.url}" with body { data: ${number} }`, )
        const { data } = await axios({
                method: 'POST',
                url: this.url,
                headers: { 'Content-Type': 'application/json' },
                body: { data: number }
            })
            .catch(err => {
                if(err.message === 'Network Error'){
                    logger.error(`POST:${this.url} was failed with error: Network Error`);
                    throw err.message;
                }

                const { status, statusText } = err.response || {};
                if(status === 403){
                    return { data: null };
                }

                throw statusText;
            });
        logger.debug('request was successfully send with response request id: ', data );
        return data;
    }

    async getResponse(request_id){
        logger.debug(`sending request to "GET:${this.url}" with request id:`, request_id )
        const { data: result } = await axios({
                method: 'GET',
                url: `${this.url}?request_id=${request_id}`
            })
            .catch(err => {
                const { status, statusText } = err.response;
                if(status === 400 && statusText !== 'Bad Request'){
                    return { data: null };
                }

                else throw err;
            });
        if(result){
            logger.debug('request was successfully send with response result: ', result );
        }
        return result;
    }
}

const request = new Request(API_END_POINT);

module.exports = request;
