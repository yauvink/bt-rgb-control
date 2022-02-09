import React from "react";
import "./App.css";
import Test from "./components/test";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hello world
        </a>
        <Test
          onClick={() => {
            console.log("Hello TS");
          }}
        ></Test>
      </header>
    </div>
  );
}

export default App;
