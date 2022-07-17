'use strict'

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import { postValue, getSensorByDay, getSensorLastDay } from './routes/sensor.js'

const host = process.env.SERVER_HOST
const port = process.env.SERVER_PORT

if (process.env.DB_HOST == undefined)
  throw new Error('Missing enviroment variable DB_HOST')
console.log(`Connecting to ${process.env.DB_HOST}`)
mongoose.connect(process.env.DB_HOST)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

const app = express();
if (process.env.SERVER_LOGGING)
  app.use(morgan('tiny'))
app.use(cors());
app.use(express.json())

app.get('/api/test', (_, res) => {
  res.json({ alive: true })
})

app.get('/api/sensor/:id/day/last', getSensorLastDay)
app.get('/api/sensor/:id/day/:timestamp', getSensorByDay)
app.post('/api/sensor', postValue)

app.listen(port, host)
console.log(`Listening at ${host}:${port}`)

export default app