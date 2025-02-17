import React, { useState } from "react";
import {
  calculateRequiredSubnetMask,
  getClassDefaultIP,
  calculateNetworkAddress,
  calculateBroadcastAddress,
  calculateFirstUsableIp,
  calculateLastUsableIp,
  prefixToDecimal
} from "./Subnet_Logic";

const DevicesCalculator = ({ onResultsUpdate }) => {
  const [ipClass, setIpClass] = useState("A");
  const [devices, setDevices] = useState("");
  const [errors, setErrors] = useState({});

  const classLimits = {
    A: 16777214,
    B: 65534,
    C: 65534,
  };

  const handleDevicesChange = (value) => {
    let numDevices = parseInt(value, 10) || 1;
    let maxDevices = classLimits[ipClass];

    if (numDevices > maxDevices) {
      numDevices = maxDevices;
      setErrors({ devices: `Exceeded limit for Class ${ipClass}. Max allowed: ${maxDevices} devices.` });
    } else {
      setErrors({});
    }

    setDevices(numDevices);
  };

  const calculateDevicesSubnet = () => {
    const calculatedIP = getClassDefaultIP(ipClass);
    const calculatedSubnetMask = calculateRequiredSubnetMask(devices);
    const networkAddress = calculateNetworkAddress(calculatedIP, calculatedSubnetMask);
    const broadcastAddress = calculateBroadcastAddress(networkAddress, calculatedSubnetMask);
    const firstIp = calculateFirstUsableIp(networkAddress, calculatedSubnetMask);
    const lastIp = calculateLastUsableIp(broadcastAddress, calculatedSubnetMask);
    const decimalSubnetMask = prefixToDecimal(calculatedSubnetMask);

    onResultsUpdate({ networkAddress, broadcastAddress, firstIp, lastIp, subnetMask: calculatedSubnetMask, decimalSubnetMask });
  };

  return (
    <div className="section">
      <label>IP Class:</label>
      <select value={ipClass} onChange={(e) => setIpClass(e.target.value)}>
        <option value="A">Class A</option>
        <option value="B">Class B</option>
        <option value="C">Class C</option>
      </select>

      <label>Number of Devices:</label>
      <input type="number" placeholder="e.g., 50" value={devices} onChange={(e) => handleDevicesChange(e.target.value)} />
      {errors.devices && <p className="error">{errors.devices}</p>}

      <button onClick={calculateDevicesSubnet}>Calculate</button>
    </div>
  );
};

export default DevicesCalculator;
