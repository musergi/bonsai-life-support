'use strict'

import chai from 'chai'
import chaiHttp from 'chai-http'
import Sensor from '../models/sensor.js'
import server from '../server.js'
const should = chai.should()

chai.use(chaiHttp)
describe('Sensor', () => {
    beforeEach(async () => {
        await Sensor.deleteMany()
        const dayStart = 1657843200000 // 2022-07-15 00:00:00
        const dayEnd = 1658016000000 // 2022-07-17 00:00:00
        let data = []
        let timestampPtr = dayStart
        while (timestampPtr < dayEnd) {
            data.push({ timestamp: timestampPtr, sensorId: 3, sensorValue: 512 })
            timestampPtr += 100000 // A sample every 10 seconds
        }
        await Sensor.insertMany(data)
        const res = await chai.request(server)
            .get('/api/test')
        res.should.have.status(200)
    })

    describe('GET /sensor/:id/day/:timestamp', () => {
        it('it should return hour splits of the day data', async () => {
            // Resquest for 2022-07-16 00:00:00
            const res = await chai.request(server)
                .get('/api/sensor/3/day/1657929600000')
            res.should.have.status(200)
            res.body.should.have.length(25)
            res.body.forEach((element, index) => {
                element.timestamp.should.equal(1657929600000 + 60 * 60 * 1000 * index)
            })
        })
    })

    describe('GET /sensor/:id/last', () => {
        it('it should return the last sample recorded by the sensor', async () => {
            const res = await chai.request(server)
                .get('/api/sensor/3/last')
            res.should.have.status(200)
            res.body.timestamp.should.equal(1658016000000 - 100000)
        })
    })

    describe('GET /sensor/:id/day/last', () => {
        it('it should return hour splits of the last day', async () => {
            const res = await chai.request(server)
                .get('/api/sensor/3/day/last')
            res.should.have.status(200)
            res.body.should.have.length(25)
            res.body.forEach((element, index) => {
                element.timestamp.should.equal(1657926000000 + 60 * 60 * 1000 * index)
            })
        })
    })

    describe('POST /sensor', () => {
        it('it should increase sensor data count on post', async () => {
            const initialCount = await Sensor.find().count()
            const res = await chai.request(server)
                .post('/api/sensor')
                .send({ timestamp: 1500000000, sensorId: 3, sensorValue: 512 })
            res.should.have.status(200)
            const finalCount = await Sensor.find().count()
            finalCount.should.equal(initialCount + 1)
        })

        it('it should throw an error if sensor id missing', async () => {
            const noIdResponse = await chai.request(server)
                .post('/api/sensor')
                .send({ timestamp: 1500000000, sensorValue: 512 })
            noIdResponse.should.have.status(400)
        })

        it('it should throw an error if timestamp missing', async () => {
            const noTimestampResponse = await chai.request(server)
                .post('/api/sensor')
                .send({ sensorId: 3, sensorValue: 512 })
            noTimestampResponse.should.have.status(400)
        })

        it('it should throw an error if value missing', async () => {
            const noValueResponse = await chai.request(server)
                .post('/api/sensor')
                .send({ timestamp: 1500000000, sensorId: 3 })
            noValueResponse.should.have.status(400)
        })
    })
})
