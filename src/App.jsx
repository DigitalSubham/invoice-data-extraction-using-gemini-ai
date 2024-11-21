import { useState } from "react";
import Body from "./components/Body";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-red-500 ">Swipe Dashboard</h1>
      <Body />
    </div>
  );
}

export default App;
