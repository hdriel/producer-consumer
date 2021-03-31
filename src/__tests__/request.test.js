const request = require('../utils/request');

/**
 * @jest-environment node
 */
describe('Test QUEUE' , function () {
    jest.setTimeout(60 * 1000)

    it('check request & response', async () => {
        console.log('Send request with { data: 5 } body');
        const data = await request.sendRequest(5);
        console.log('Got response:', JSON.stringify(data || ''));
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
                console.log('Try to get result for request_id', request_id);

                // try to get result response
                await request.getResponse(request_id)
                    .then(res => {
                        // get res = null when not finished to handle this request_id
                        if(res){
                            console.log('Got response for request_id ', request_id, ' result: ', res);
                            clearInterval(intervalId);
                            expect(res).toHaveProperty('result');
                            resolve(res.result);
                        }
                    })
                    .catch(err => {
                        // Can failed with status 403 and return appropriate message, till request_id task will finished.
                        const { status, data } = err.response || {};
                        expect(status).toBe(400);
                        expect(data).toHaveProperty('error', request_id + ' is still in progress');
                    });

            }, nextTick)
        });
    });

    it('check max request', async () => {
        console.log('Send request with { data: 5 } body');
        let stop = false;
        let i = 1;
        while (!stop){
            console.log('Send request no.', i);
            const data = await request.sendRequest(i);
            console.log('Send request no.', i, ' data: ', JSON.stringify(data));

            stop = data === null;
            i = i + (stop ? -1 : 1);
        }
        expect(i).toBe(5);
    });
});