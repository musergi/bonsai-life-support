const remap = (value, low1, high1, low2, high2) => low2 + (high2 - low2) * (value - low1) / (high1 - low1)

const XAxis = props => {
    const { x, y, size, ticks, labels } = props
    const tickSize = 5
    const axisStyle = { stroke: 'black', strokeWidth: 2 }
    const transform = `translate(${x} ${y})`
    const tickLines = ticks.map((t, i) => <line key={i} x1={t} y1={-tickSize} x2={t} y2={tickSize} style={axisStyle}></line>)
    const texts = labels.map((l, i) => <text key={i} x={ticks[i] - 18} y={20}>{l}</text>)

    return (
        <g transform={transform}>
            <line x1={0} y1={0} x2={size} y2={0} style={axisStyle} />
            {tickLines}
            {texts}
        </g>
    )
}

const Graph = props => {
    let { x, y, width, height } = props

    // Constants
    const margin = 50
    const labelx = 80
    const labely = 20
    const axisStyle = { stroke: 'black', strokeWidth: 2 }
    const lineStyle = { fill: 'none', stroke: 'blue', strokeWidth: 1 }

    // Calculate plot points
    const xMin = Math.min(...x)
    const xMax = Math.max(...x)
    x = x.map(v => remap(v, xMin, xMax, margin, width - margin))
    y = y.map(v => remap(v, Math.min(...y), Math.max(...y), height - margin, margin))
    const points = x.map((xv, i) => `${xv},${y[i]}`).join(' ')

    const hour = 60 * 60 * 1000
    const truncateHour = (date) => {
        const timestamp = date.getTime()
        return new Date(timestamp - (timestamp % hour))
    }
    const prevHour = (date) => new Date(date.getTime() - hour)
    const nextHour = (date) => new Date(date.getTime() + hour)
    let ticks = []
    let labels = []
    const minDate = new Date(xMin)
    const truncatedMin = truncateHour(minDate)
    let hourPtr = truncatedMin.getTime() == minDate.getTime() ? prevHour(truncatedMin) : truncatedMin
    while ((hourPtr = nextHour(hourPtr)) < new Date(xMax)) {
        ticks.push(remap(hourPtr.getTime(), xMin, xMax, 0, width - margin * 2))
        labels.push(`${hourPtr.getHours()}:00`)
    }

    const axis = {
        x: {
            min: xMin,
            max: xMax,
            ticks: [
                {position: truncatedMin.getTime(), label: '11:00'},
                {position: nextHour(truncatedMin).getTime(), label: '12:00'}
            ]
        },
    }

    return (
        <svg width={width} height={height}>
            <XAxis x={margin} y={height - margin} ticks={ticks} labels={labels} size={width - margin * 2} />
            <line x1={margin} y1={height - margin} x2={margin} y2={margin} style={axisStyle} />
            <polyline points={points} style={lineStyle} />
        </svg>
    )
}

export default Graph
