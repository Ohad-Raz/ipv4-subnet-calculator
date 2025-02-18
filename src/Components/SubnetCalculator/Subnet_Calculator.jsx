import React, { useState } from 'react';
import SubnetMaskCalculator from './SubnetMaskCalculator';
import DevicesCalculator from './DevicesCalculator';
import '../../Styles/styles.css';

const Subnet_Calculator = () => {
  const [mode, setMode] = useState('subnet');
  const [results, setResults] = useState({});

  const handleModeSwitch = (selectedMode) => {
    setMode(selectedMode);
    setResults({});
  };

  return (
    <div className="container">
      <h2>Subnet Calculator</h2>

      {/* Toggle Between Subnet Mask & Devices */}
      <div className="mode-buttons">
        <button onClick={() => handleModeSwitch('subnet')} className={mode === 'subnet' ? 'active' : ''}>
          Subnet Mask
        </button>
        <button onClick={() => handleModeSwitch('devices')} className={mode === 'devices' ? 'active' : ''}>
          Number of Devices
        </button>
      </div>

      {/* Render the Correct Component Based on Mode */}
      {mode === 'subnet' ? (
        <SubnetMaskCalculator onResultsUpdate={setResults} />
      ) : (
        <DevicesCalculator onResultsUpdate={setResults} />
      )}

      {/* Display Results */}
      {results.networkAddress && (
        <div className="results">
          <h3>Results</h3>
          <p><strong>Network Address:</strong> {results.networkAddress}</p>
          {results.broadcastAddress && <p><strong>Broadcast Address:</strong> {results.broadcastAddress}</p>}
          {results.firstIp && <p><strong>First Usable IP:</strong> {results.firstIp}</p>}
          {results.lastIp && <p><strong>Last Usable IP:</strong> {results.lastIp}</p>}
          <p><strong>Subnet Mask:</strong> {results.decimalSubnetMask} /{results.subnetMask}</p>
        </div>
      )}
    </div>
  );
};

export default Subnet_Calculator;
