const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

const units = {
    'second': second,
    'minute': minute,
    'hour': hour,
    'day': day
}

const truncate = (timestamp, unit) => timestamp - (timestamp % units[unit])

const previous = (timestamp, unit) => timestamp - units[unit]

const next = (timestamp, unit) => timestamp + units[unit]

const range = (start, end, unit) => {
    let res = []
    while (start <= end) {
        res.push(start)
        start += units[unit]
    }
    return res
}

const isAround = (reference, timestamp, unit) => Math.abs(reference - timestamp) < units[unit] / 2

export default { truncate, next, previous, range, isAround }