import React, { useState } from 'react';
import {
  calculateNetworkAddress,
  calculateBroadcastAddress,
  calculateFirstUsableIp,
  calculateLastUsableIp,
  calculateRequiredSubnetMask,
  prefixToDecimal,
  validateIP,
  getClassDefaultIP
} from './Subnet_Logic';

const Subnet_Calculator = () => {
  const [mode, setMode] = useState('subnet'); // 'subnet' or 'devices'
  const [ip, setIp] = useState('');
  const [subnet, setSubnet] = useState('');
  const [devices, setDevices] = useState('');
  const [ipClass, setIpClass] = useState('A');
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({});

  const handleModeSwitch = (selectedMode) => {
    setMode(selectedMode);
    setResults({});
    setErrors({});
    setIp('');
    setSubnet('');
    setDevices('');
  };

  const handleIPChange = (value) => {
    let cleanedValue = value.replace(/[^0-9.]/g, ''); // Remove invalid characters
    cleanedValue = cleanedValue.replace(/\.{2,}/g, '.'); // Prevent multiple consecutive dots

    const octets = cleanedValue.split('.');

    if (octets.length > 4) {
        setErrors({ ...errors, ip: 'Invalid action: Only 4 octets allowed.' });
        return;
    }

    let invalidAction = false; // Flag to track if an error occurred

    const processedOctets = octets.map((octet) => {
        if (octet === '') return ''; // Allow the user to type

        let num = parseInt(octet, 10);
        if (isNaN(num)) return '';

        if (num > 255) {
            invalidAction = true;
            return '255'; // Auto-correct to 255
        }

        return String(num); // Convert back to string (removes leading zeros)
    });

    if (invalidAction) {
        setErrors({ ...errors, ip: 'Invalid action: Octets must be between 0 and 255.' });
    } else {
        setErrors({ ...errors, ip: '' });
    }

    setIp(processedOctets.join('.'));
};


const handleSubnetChange = (value) => {
  // Remove all non-numeric characters except single leading zero
  let cleanedValue = value.replace(/[^0-9]/g, '');
  
  // Prevent multiple leading zeros
  cleanedValue = cleanedValue.replace(/^0+(?=\d)/, '');

  // Convert to integer and clamp between 0-32
  let num = parseInt(cleanedValue, 10);
  if (isNaN(num)) num = ''; // Allow empty value during typing

  if (num > 32) {
      setErrors({ ...errors, subnet: 'Invalid action: Subnet Mask must be between 0 and 32.' });
      num = 32; // Auto-correct to 32
  } else {
      setErrors({ ...errors, subnet: '' });
  }

  setSubnet(num.toString());
};


  const handleDevicesChange = (value) => {
    const sanitizedValue = Math.min(Math.max(parseInt(value, 10) || 1, 1), 4294967296);
    setDevices(sanitizedValue);
    setErrors({ ...errors, devices: '' });
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {};

    if (mode === 'subnet') {
      if (!validateIP(ip)) {
        newErrors.ip = 'Invalid IP Address format. Provide a valid IPv4 address.';
        isValid = false;
      }
      if (subnet === '' || subnet < 0 || subnet > 32) {
        newErrors.subnet = 'Invalid Subnet Mask. Must be between 0 and 32.';
        isValid = false;
      }
    } else {
      if (!['A', 'B', 'C'].includes(ipClass)) {
        newErrors.ipClass = 'Invalid IP Class selection.';
        isValid = false;
      }
      if (devices === '' || isNaN(devices) || devices <= 0 || devices > 4294967296) {
        newErrors.devices = 'Invalid number of devices. Must be between 1 and 4,294,967,296.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateSubnet = () => {
    if (!validateInputs()) return;

    let calculatedIP = ip;
    let calculatedSubnetMask = subnet;

    if (mode === 'devices') {
      calculatedIP = getClassDefaultIP(ipClass);
      calculatedSubnetMask = calculateRequiredSubnetMask(devices);
    }

    const networkAddress = calculateNetworkAddress(calculatedIP, calculatedSubnetMask);
    const broadcastAddress = calculateBroadcastAddress(networkAddress, calculatedSubnetMask);
    const firstIp = calculateFirstUsableIp(networkAddress, calculatedSubnetMask);
    const lastIp = calculateLastUsableIp(broadcastAddress, calculatedSubnetMask);
    const decimalSubnetMask = prefixToDecimal(calculatedSubnetMask);

    setResults({
      networkAddress,
      broadcastAddress,
      firstIp,
      lastIp,
      subnetMask: calculatedSubnetMask,
      decimalSubnetMask,
    });
  };

  return (
    <div>
      <h3>Subnet Calculator</h3>
      <div>
        <button onClick={() => handleModeSwitch('subnet')} className={mode === 'subnet' ? 'active' : ''}>
          Subnet Mask
        </button>
        <button onClick={() => handleModeSwitch('devices')} className={mode === 'devices' ? 'active' : ''}>
          Number of Devices
        </button>
      </div>

      {mode === 'subnet' ? (
        <>
          <label>IP Address:</label>
          <input type="text" placeholder="e.g., 192.168.0.1" value={ip} onChange={(e) => handleIPChange(e.target.value)} />
          {errors.ip && <p className="error">{errors.ip}</p>}

          <label>Subnet Mask:</label>
          <input type="number" placeholder="e.g., 24" value={subnet} onChange={(e) => handleSubnetChange(e.target.value)} />
          {errors.subnet && <p className="error">{errors.subnet}</p>}
        </>
      ) : (
        <>
          <label>IP Class:</label>
          <select value={ipClass} onChange={(e) => setIpClass(e.target.value)}>
            <option value="A">Class A</option>
            <option value="B">Class B</option>
            <option value="C">Class C</option>
          </select>

          <label>Number of Devices:</label>
          <input type="number" placeholder="e.g., 50" value={devices} onChange={(e) => handleDevicesChange(e.target.value)} />
          {errors.devices && <p className="error">{errors.devices}</p>}
        </>
      )}

      <button onClick={calculateSubnet}>Calculate</button>

      {results.networkAddress && (
        <div>
          <p>Network Address: {results.networkAddress}</p>
          <p>Broadcast Address: {results.broadcastAddress}</p>
          <p>First Usable IP: {results.firstIp}</p>
          <p>Last Usable IP: {results.lastIp}</p>
          <p>Subnet Mask: {results.decimalSubnetMask} /{results.subnetMask}</p>
        </div>
      )}
    </div>
  );
};

export default Subnet_Calculator;
