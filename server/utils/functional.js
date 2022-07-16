const meanReduce = (acc, el) => ({ sum: acc.sum + el, count: acc.count + 1 })
const meanInit = () => ({ sum: 0, count: 0 })

export default { meanReduce, meanInit }