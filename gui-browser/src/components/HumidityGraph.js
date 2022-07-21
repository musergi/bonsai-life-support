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

const HumidityGraph = ({ id, color }) => {
    const [timestamps, setTimestamps] = useState([])
    const [humidities, setHumidities] = useState([])

    useEffect(() => {
        getLastDay(id).then(samples => {
            setTimestamps(samples.map(sample => sample.timestamp).map(formatTimestamp))
            setHumidities(samples.map(sample => sample.sensorValue).map(convertHumidity))
        })
    }, [id])

    const bigFont = { size: 24 }

    const xAxisConfig = {
        title: {
            text: 'Time',
            color: color,
            display: true,
            font: bigFont
        },
        grid: {
            color: color + '88',
            borderColor: color,
        },
        ticks: {
            color: color,
        }
    }

    const yAxisConfig = {
        title: {
            text: 'Humidity',
            color: color,
            display: true,
            font: bigFont
        },
        grid: {
            color: color + '88',
            borderColor: color,
        },
        ticks: {
            color: color,
            callback: (value) => value + '%'
        }
    }

    return <div className='HumidityGraph'>
        <Line
            data={{
                labels: timestamps,
                datasets: [
                    {
                        label: 'Sensor Value',
                        data: humidities,
                        borderColor: color,
                        backgroundColor: color,
                        cubicInterpolationMode: 'monotone',
                        tension: 0.4
                    }
                ]
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: xAxisConfig,
                    y: yAxisConfig
                },
                plugins: { legend: { display: false } },
            }}
        />
    </div>
}

export default HumidityGraph
