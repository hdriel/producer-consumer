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
            url: this.url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                data: number
            }
        });
        logger.debug('request was successfully send with response request id: ', data );
        return data;
    }

    async getResponse(request_id){
        logger.debug(`sending request to "GET:${this.url}" with request id:`, request_id )
        const { data: result } = await axios({
                url: `${this.url}?request_id=${request_id}`,
                method: 'GET'
            })
            .catch(err => {
                const { status, statusText } = err.response;
                if(status === 400 && statusText !== 'Bad Request'){
                    return { data: null };
                }

                else throw statusText;
            });
        if(result){
            logger.debug('request was successfully send with response result: ', result );
        }
        return result;
    }
}

const request = new Request(API_END_POINT);

module.exports = request;
