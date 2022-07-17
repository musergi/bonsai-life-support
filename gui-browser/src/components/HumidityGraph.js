import { getLastDay } from '../services/api'
import './HumidityGraph.css'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { useEffect, useState } from 'react'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.getHours()}:00`
}

const convertHumidity = (sensorValue) => (1023 - sensorValue) / 1023 * 100

const HumidityGraph = ({ sensorId }) => {
    const [timestamps, setTimestamps] = useState([])
    const [humidities, setHumidities] = useState([])

    useEffect(() => {
        let mounted = true
        getLastDay(sensorId).then(samples => {
            if (mounted) {
                setTimestamps(samples.map(sample => sample.timestamp).map(formatTimestamp))
                setHumidities(samples.map(sample => sample.sensorValue).map(convertHumidity))
            }
        })
    })
    return <div className='HumidityGraph'>
        <Line
            data={{
                labels: timestamps,
                datasets: [
                    {
                        label: 'Sensor Value',
                        data: humidities,
                        borderColor: 'rgb(134, 171, 165)',
                        backgroundColor: 'rgba(134, 171, 165, 0.5)',
                        cubicInterpolationMode: 'monotone',
                        tension: 0.4
                    }
                ]
            }}

            options={{
                responsive: true,
                maintainAspectRatio: false
            }}
        />
    </div>
}

export default HumidityGraph