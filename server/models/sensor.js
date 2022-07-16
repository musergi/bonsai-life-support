import mongoose from "mongoose"
const { Schema } = mongoose

const SensorSchema = new Schema(
    {
        timestamp: { type: Number, required: true },
        sensorId: { type: Number, required: true },
        sensorValue: { type: Number, required: true },
    },
    {
        versionKey: false
    }
)

export default mongoose.model('sensor', SensorSchema)