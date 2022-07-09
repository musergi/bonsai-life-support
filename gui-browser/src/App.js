import React from "react";
import Graph from "./Graph";
import Api from './services/Api';

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
    return (
      <div>
        <Graph data={this.state.sensorData} width="400" height="400" />
      </div>
    );
  }
}

export default App;
