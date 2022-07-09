class Api {
    constructor(url) {
        this.url = url;
    }

    async get(path) {
        let res = await fetch(this.url + path);
        return await res.json();
    }

    getSensor(sensorId) {
        return this.get('/sensor/' + sensorId);
    }
}

export default Api;