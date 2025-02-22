import React from "react";
// import './App.css';
import "./Styles/styles.css";

import Calculator_Page from "./Pages/Calculator_Page";

function App() {
  return (
    <div className="App">
      <header>
        <h1>IPv4 Subnet Calculator</h1>
      </header>
      <main>
        <Calculator_Page />
      </main>
    </div>
  );
}

export default App;
