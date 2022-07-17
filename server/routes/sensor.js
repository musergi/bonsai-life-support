import Sensor from '../models/sensor.js'
import t from '../utils/timestamp.js'
import f from '../utils/functional.js'

const postValue = async (req, res) => {
    try {
        const value = new Sensor(req.body)
        await value.save()
    } catch {
        res.sendStatus(400)
    }
    res.sendStatus(200)
}

const getSensorByDay = async (req, res) => {
    try {
        const timestamp = Number(req.params.timestamp)
        const dayStart = t.truncate(timestamp, 'day')
        const dayEnd = t.next(dayStart, 'day')
        const samples = await Sensor.find({ timestamp: { $gte: dayStart, $lte: dayEnd }, sensorId: Number(req.params.id) })
        const bucketKeys = t.range(dayStart, dayEnd, 'hour')
        let buckets = bucketKeys.map(bucketKey => samples.filter(sample => t.isAround(bucketKey, sample.timestamp, 'hour')))
        buckets = buckets.map(bucket => bucket.map((v) => v.sensorValue).reduce(f.meanReduce, f.meanInit())).map(f.meanEnd)
        const result = bucketKeys.map((key, i) => ({ timestamp: key, sensorValue: buckets[i], sensorId: req.params.id }))
        res.json(result)
    } catch (err) {
        res.sendStatus(400)
    }
}

const getSensorLastDay = async (req, res) => {
    try {
        const timestamp = Number(req.params.timestamp)
        const id = Number(req.params.id)
        const lastSample = await Sensor.findOne({ sensorId: id }).sort({ timestamp: 'desc' })
        const dayEnd = t.truncate(lastSample.timestamp, 'hour')
        const dayStart = t.previous(dayEnd, 'day')
        const samples = await Sensor.find({ timestamp: { $gte: dayStart, $lte: dayEnd }, sensorId: id })
        const bucketKeys = t.range(dayStart, dayEnd, 'hour')
        let buckets = bucketKeys.map(bucketKey => samples.filter(sample => t.isAround(bucketKey, sample.timestamp, 'hour')))
        buckets = buckets.map(bucket => bucket.map((v) => v.sensorValue).reduce(f.meanReduce, f.meanInit())).map(f.meanEnd)
        const result = bucketKeys.map((key, i) => ({ timestamp: key, sensorValue: buckets[i], sensorId: req.params.id }))
        res.json(result)
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
}

export { postValue, getSensorByDay, getSensorLastDay }