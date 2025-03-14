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
    B: 1048574,
    C: 65534,
  };

  const handleDevicesChange = (value) => {
    let numDevices = parseInt(value, 10);

    // Validation: Prevent empty, negative, or zero values
    if (isNaN(numDevices) || numDevices <= 0) {
      setErrors({ devices: "Please enter a valid number of devices (greater than 0)." });
      setDevices(""); // Clear input
      return;
    }

    let maxDevices = classLimits[ipClass];

    if (numDevices > maxDevices) {
      setErrors({ devices: `Exceeded limit for Class ${ipClass}. Max allowed: ${maxDevices} devices.` });
      setDevices(maxDevices); // Auto-correct to the max allowed
    } else {
      setErrors({});
      setDevices(numDevices);
    }
  };

  const handleClassChange = (newClass) => {
    setIpClass(newClass);
    let maxDevices = classLimits[newClass];

    // Adjust device count if exceeding new class limit
    if (devices > maxDevices) {
      setDevices(maxDevices);
      setErrors({ devices: `Adjusted to max allowed: ${maxDevices} for Class ${newClass}.` });
    } else {
      setErrors({});
    }
  };

  const calculateDevicesSubnet = () => {
    if (!devices) {
      setErrors({ devices: "Please enter a valid number of devices." });
      return;
    }

    const calculatedIP = getClassDefaultIP(ipClass);
    const calculatedSubnetMask = calculateRequiredSubnetMask(devices);
    const networkAddress = calculateNetworkAddress(calculatedIP, calculatedSubnetMask);
    const broadcastAddress = calculateBroadcastAddress(networkAddress, calculatedSubnetMask);
    const firstIp = calculateFirstUsableIp(networkAddress, calculatedSubnetMask);
    const lastIp = calculateLastUsableIp(broadcastAddress, calculatedSubnetMask);
    const decimalSubnetMask = prefixToDecimal(calculatedSubnetMask);

    onResultsUpdate({ 
      networkAddress, 
      broadcastAddress, 
      firstIp, 
      lastIp, 
      subnetMask: calculatedSubnetMask, 
      decimalSubnetMask 
    });
  };

  return (
    <div className="container">
      <div className="section">
        <div className="input-group">
          <label>
            IP Class:
            <span className="tooltip"> ⓘ
              <span className="tooltip-text">
                <strong>Class A:</strong> Up to 16,777,214 devices (/8)<br />
                <strong>Class B:</strong> Up to 1,048,574 devices (/12)<br />
                <strong>Class C:</strong> Up to 65,534 devices (/16)
              </span>
            </span>
          </label>
          <select value={ipClass} onChange={(e) => handleClassChange(e.target.value)}>
            <option value="A">Class A</option>
            <option value="B">Class B</option>
            <option value="C">Class C</option>
          </select>
        </div>

        <div className="input-group">
          <label>Number of Devices:</label>
          <input 
            type="number" 
            placeholder="e.g., 50" 
            value={devices} 
            onChange={(e) => handleDevicesChange(e.target.value)} 
          />
          {errors.devices && <p className="error">{errors.devices}</p>}
        </div>
      </div>
  
      <button onClick={calculateDevicesSubnet}>Calculate</button>
    </div>
  );
};

export default DevicesCalculator;
