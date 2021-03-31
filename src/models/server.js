const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser')
const {
    LOCAL_SERVER: {
        PORT,
        DYNAMIC_SCALE_TASKS,
        DYNAMIC_SCALE_TASKS_MIN_SIZE,
        DYNAMIC_SCALE_TASKS_MAX_SIZE
    }
} = require('../utils/consts');

const app = express();

// #########################################################################################
// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type');
    next();
});

// #########################################################################################
// Model
class DataModel{
    constructor(size) {
        this.data = new Map();
        this.counter = 0;
        this.size = size;
        if(DYNAMIC_SCALE_TASKS){
            setInterval(() => {
                this.size = Math.floor(Math.random() * DYNAMIC_SCALE_TASKS_MAX_SIZE) + DYNAMIC_SCALE_TASKS_MIN_SIZE;
            }, 3 * 1000);
        }
    }

    createJob(data){
        if(this.counter >= this.size){
            throw 'MAXIMUM JOBS';
        }

        this.counter++;
        const request_id = uuid();
        this.data.set(request_id, { data, result: null });

        const randomJobTimeout = Math.floor(Math.random() * 8) + 2;
        setTimeout(() => {
            this.data.set(request_id, {
                data,
                result: Math.floor(Math.random() * 1000) + 1
            });
            this.counter--;
        }, randomJobTimeout * 1000);

        return request_id;
    }

    getJobResult(request_id){
        return this.data.get(request_id) || {};
    }
}
const dataModel = new DataModel(DYNAMIC_SCALE_TASKS_MIN_SIZE);


// #########################################################################################
// Route
const router = express.Router();
router.get('/', (req, res) => {
    const { request_id } = req.query;
    if(!request_id) {
        return res.status(403).send('Missing ?request_id=<uuid string> query param');
    }

    const { result } = dataModel.getJobResult(request_id);
    if(!result){
        return res.status(400).json({ error: request_id + " is still in progress" });
    }

    console.log(`GET: RESULT FOR REQUEST-ID '${request_id}' JOB IS: ${result}`);
    return res.json({ result })
});

router.post('/', (req, res) => {
    try {
        const { data } = req.body;
        if(data === undefined) {
            return res.status(400).send('Missing { data: <Number> } body json object');
        }

        const request_id = dataModel.createJob(data);

        console.log(`POST: CREATE A NEW JOB WITH REQUEST-ID: '${request_id}'`)
        return res.json({ request_id });
    } catch (err) {
        if(err === 'MAXIMUM JOBS'){
            console.warn('Max tasks received');
            return res.status(403).json({ error: "Max tasks received" });
        }

        return res.sendStatus(500);
    }
});

app.use('/', router);

// #########################################################################################
// listen to port
app.listen(PORT, () => console.log(`server listening at: http://localhost:${PORT}`));