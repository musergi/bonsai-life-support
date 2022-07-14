import React from "react"
import Api from './services/Api'
import { Line } from 'react-chartjs-2'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      sensorData: []
    };
  }

  componentDidMount() {
    const api = new Api('http://localhost:35000/api');
    api.getSensor(1)
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            sensorData: result
          });
        })
      .then((error) => {
        this.setState({
          isLoaded: true,
          error
        });
      });
  }

  render() {
    const x = this.state.sensorData.map(dp => dp.timestamp).slice(0, 20).map(v => new String(v))
    const y = this.state.sensorData.map(dp => dp.sensorValue).slice(0, 20)
    return (
      <div>
        <Line
          data={{
            labels: x,
            datasets: [
              {
                label: 'Sensor Value',
                data: y,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
              }
            ]
          }}
        />
      </div>
    );
  }
}

export default App;
