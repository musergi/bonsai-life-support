const meanReduce = (acc, el) => ({ sum: acc.sum + el, count: acc.count + 1 })
const meanInit = () => ({ sum: 0, count: 0 })
const meanEnd = ({ sum, count }) => count == 0 ? 0 : sum / count

export default { meanReduce, meanInit, meanEnd }