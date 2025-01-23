import React, { useState } from 'react';
import {
  calculateNetworkAddress,
  calculateBroadcastAddress,
  calculateFirstUsableIp,
  calculateLastUsableIp,
  calculateRequiredSubnetMask,
  prefixToDecimal,
  validateIP,
} from './Subnet_Logic';
import Input_Field from './Input_Field';
import Error_Message from './Error_Message';

const Subnet_Calculator = () => {
  const [ip, setIp] = useState('');
  const [subnet, setSubnet] = useState('');
  const [devices, setDevices] = useState('');
  const [useDevices, setUseDevices] = useState(false);
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({ ip: '', subnet: '', devices: '' });

  const handleIPInput = (value) => {
    const octets = value.split('.').map((octet) => Math.min(255, Math.max(0, parseInt(octet, 10) || 0)));
    if (octets.length > 4) {
      setErrors({ ...errors, ip: 'Invalid IP Address format. Provide a valid IPv4 address.' });
    } else {
      setIp(octets.join('.'));
      setErrors({ ...errors, ip: '' });
    }
  };

  const handleSubnetInput = (value) => {
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    const validatedValue = Math.min(32, Math.max(0, parseInt(sanitizedValue, 10) || 0));
    setSubnet(validatedValue);
    setErrors({ ...errors, subnet: '' });
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {};

    if (!validateIP(ip)) {
      newErrors.ip = 'Invalid IP Address format. Provide a valid IPv4 address.';
      isValid = false;
    }

    if (!useDevices && (subnet === '' || subnet < 0 || subnet > 32)) {
      newErrors.subnet = 'Invalid Subnet Mask. Must be between 0 and 32.';
      isValid = false;
    }

    if (useDevices && (devices === '' || isNaN(devices) || devices <= 0 || devices > 4294967296)) {
      newErrors.devices = 'Invalid number of devices. Must be between 1 and 4,294,967,296.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateSubnet = () => {
    if (!validateInputs()) return;

    let calculatedSubnetMask = useDevices ? calculateRequiredSubnetMask(devices) : subnet;
    const networkAddress = calculateNetworkAddress(ip, calculatedSubnetMask);
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
      <Input_Field
        label="IP Address"
        value={ip}
        onChange={handleIPInput}
        placeholder="e.g., 192.168.0.1"
        error={errors.ip}
      />
      <label>
        <input
          type="checkbox"
          checked={useDevices}
          onChange={(e) => setUseDevices(e.target.checked)}
        />
        Use Number of Devices
      </label>
      {useDevices ? (
        <Input_Field
          label="Number of Devices"
          value={devices}
          onChange={setDevices}
          type="number"
          placeholder="e.g., 50"
          error={errors.devices}
        />
      ) : (
        <Input_Field
          label="Subnet Mask"
          value={subnet}
          onChange={handleSubnetInput}
          type="text"
          placeholder="e.g., 24"
          error={errors.subnet}
        />
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
