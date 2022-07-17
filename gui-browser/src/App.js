import './App.css'
import HumidityGraph from "./components/HumidityGraph";
import SideBar from "./components/SideBar";

const App = () => {
  return (
    <div className="App">
      <HumidityGraph sensorId={3} />
      <SideBar sensorId={3} />
    </div>
  );
}

export default App;
