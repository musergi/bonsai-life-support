'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const port = process.env.SERVER_PORT;
const host = process.env.SERVER_HOST;

const app = express();
app.use(morgan('tiny'));
app.use(cors());

app.get('/api/sensor/:id', (_, res) => {
  const startTimestamp = 1657357200000;
  const resultSet = []
  let sensorValue =  512;
  for (let i = 0; i < 1000; i++) {
    sensorValue += Math.floor(Math.random() * 10 - 5);
    sensorValue = Math.min(1023, Math.max(0, sensorValue));
    resultSet.push( {timestamp: startTimestamp + i * 10000, sensorId: 1, sensorValue: sensorValue });
  }
  res.json(resultSet);
});

app.get('/api/test', (_, res) => {
  res.json({ alive: true });
});

app.listen(port, host);