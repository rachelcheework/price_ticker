import PriceTicker from "./PriceTicker";
import { useEffect } from "react";
import { connectPriceSockets, disconnectPriceSockets } from "./socketsManagement/socketManager";

function App() {
  useEffect(() => {
    connectPriceSockets();

    return () => {
      disconnectPriceSockets();
    };
  }, []);

  return (<div>

    <PriceTicker/>
  </div>);
}

export default App
