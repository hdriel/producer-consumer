const request = require('../utils/request');

/**
 * @jest-environment node
 */
describe('Test QUEUE' , function () {
    jest.setTimeout(60 * 1000)

    it('check request', async () => {
        const data = await request.sendRequest(5);
        expect(data).toHaveProperty('request_id');
        const { request_id } = data;

        await new Promise((resolve, reject) => {
            let maxTimeout = 8000;
            let currentTimeout = 0;
            let nextTick = 1000;

            const intervalId = setInterval(async () => {
                // Check for maximum timeout checks
                if(currentTimeout > maxTimeout){
                    clearInterval(intervalId);
                    reject('Maximum time out');
                }
                currentTimeout += nextTick;

                // try to get result response
                await request.getResponse(request_id)
                    .then(res => {
                        // get res = null when not finished to handle this request_id
                        if(res){
                            clearInterval(intervalId);
                            expect(res).toHaveProperty('result');
                            resolve(res.result);
                        }
                    })
                    .catch(err => {
                        // Can failed with status 403 and return appropriate message, till request_id task will finished.
                        const {status, statusText} = err.response || {};
                        expect(status).toBe(400);
                        expect(statusText).not.toBe('Bad Request');
                        reject();
                    });

            }, nextTick)
        });
    });
});