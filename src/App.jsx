import React from 'react';
import './App.css';
import SubnetCalculator from './Components/SubnetCalculator/Subnet_Calculator';
import BinaryConverter from './Components/BinaryConverter/Binary_Converter';

function App() {
  return (
    <div className="App">
      <header>
        <h1>IPv4 Subnet Calculator</h1>
      </header>
      <main>
        <BinaryConverter />
        <SubnetCalculator />
      </main>
    </div>
  );
}

export default App;
