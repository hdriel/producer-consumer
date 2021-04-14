# producer-consumer
producer-consumer to handle a slow server

the scenario is in the following steps: 
1. Start from stream reading a big large size file that include numbers. 
2. send them to local server. that has 2 apis: 
2.1 get number and return request-id and create a job, that job take 2-8 second to finished. 
2.2 get request id and return the status of this job.
3. the server can handle just 5 tasks any time.

Notes:
* The client program (The one that you write) should run efficiently.
* The calculations server has limited resources - take that into consideration.
* The input file should be read as a stream (Assume that the file contains millions of numbers).
* Each calculation that the server performs takes 2-8 seconds - output order doesnt matter.
* Output should contain both input number and result.
* You are allowed to use any additional library or infrastructure.

I write a producer-consumer solution for this problem 
with a lot feature and efficiently way. and tests 

## Running
* run `npm install`
* run in the package.json file the following command: <br>
`npm run start:server` <br>
`npm run start:client` <br>
* for test run 
`npm run script test`