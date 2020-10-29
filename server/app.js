const express = require('express');
const fs = require('fs');
const app = express();
const csvFilePath = './log.csv';
const csv = require('csvtojson');

app.use((req, res, next) => {
// write your logging code here
    //console.log(req.headers);
    let agent = req.headers["user-agent"];
    let formattedAgent = agent.replace(/,/g, "");
    let time = new Date();
    let formattedTime = time.toISOString();
    let method = req.method;
    let resource = req.originalUrl;
    let version = 'HTTP/' + req.httpVersion;
    let status = res.statusCode;
    let log = `${formattedAgent},${formattedTime},${method},${resource},${version},${status}`;
    console.log(log);
    
    fs.appendFile('log.csv', log + '\n', err => {
        if (err) {
            console.log(err);
        }
    })
    next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.status(200).send("ok");
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        console.log(jsonObj);
        res.send(jsonObj);
    })
});

module.exports = app;
