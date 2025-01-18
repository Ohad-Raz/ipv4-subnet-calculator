import React, { useState } from 'react';

const SubnetCalculator = () => {
  const [ip, setIp] = useState('');
  const [subnet, setSubnet] = useState('');
  const [devices, setDevices] = useState('');
  const [useDevices, setUseDevices] = useState(false); // Toggle state
  const [results, setResults] = useState({});

  const calculateSubnet = () => {
    try {
      if (
        !ip ||
        (!useDevices && (subnet === '' || subnet < 0 || subnet > 32)) ||
        (useDevices && (!devices || isNaN(devices) || devices <= 0 || devices > 4294967296))
      ) {
        throw new Error('Please provide a valid IP address, subnet mask, or number of devices.');
      }

      let calculatedSubnetMask = subnet;
      let calculatedIp = ip;

      if (useDevices) {
        calculatedSubnetMask = calculateRequiredSubnetMask(devices); // Calculate subnet mask for devices
        calculatedIp = ip.split('/')[0]; // Use only the base IP

        if (devices === 4294967296) {
          alert(
            'Note: The full IPv4 range includes network and broadcast addresses, leaving 4,294,967,294 usable IPs.'
          );
        }
      }

      const subnetMask = parseInt(calculatedSubnetMask);
      if (!validateIP(calculatedIp) || subnetMask < 0 || subnetMask > 32) {
        throw new Error('Invalid IP, subnet mask, or device count.');
      }

      const networkAddress = calculateNetworkAddress(calculatedIp, subnetMask);
      const broadcastAddress = calculateBroadcastAddress(networkAddress, subnetMask);
      const firstIp = calculateFirstUsableIp(networkAddress, subnetMask);
      const lastIp = calculateLastUsableIp(broadcastAddress, subnetMask);

      setResults({ networkAddress, broadcastAddress, firstIp, lastIp, subnetMask });
    } catch (err) {
      setResults({}); // Clear any previous results
      alert(err.message);
    }
  };

  const calculateRequiredSubnetMask = (devices) => {
    const totalHosts = parseInt(devices); // Do not add 2 for network and broadcast when allowing full range
    const hostBits = Math.ceil(Math.log2(totalHosts)); // Calculate required host bits
    const subnetMask = 32 - hostBits;

    if (subnetMask < 0) {
      return 0; // If devices exceed IPv4 limit, return /0
    }

    return subnetMask;
  };

  const validateIP = (ip) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/; // Basic IPv4 regex validation
    if (!ipRegex.test(ip)) return false;

    const octets = ip.split('.').map(Number);
    return octets.every((octet) => octet >= 0 && octet <= 255);
  };

  const calculateNetworkAddress = (ip, mask) => {
    if (mask === 0) return '0.0.0.0'; // Special case for /0
    const ipBinary = ipToBinary(ip);
    const maskBinary = getSubnetMaskBinary(mask);
    const networkBinary = ipBinary.map((bit, i) => bit & maskBinary[i]);
    return binaryToIp(networkBinary);
  };

  const calculateBroadcastAddress = (network, mask) => {
    if (mask === 0) return '255.255.255.255'; // Special case for /0
    const maskBinary = getSubnetMaskBinary(mask).map((bit) => (bit === 1 ? 0 : 1));
    const networkBinary = ipToBinary(network);
    const broadcastBinary = networkBinary.map((bit, i) => bit | maskBinary[i]);
    return binaryToIp(broadcastBinary);
  };

  const calculateFirstUsableIp = (network, mask) => {
    if (mask === 0) return '0.0.0.1'; // Special case for /0
    const ipBinary = ipToBinary(network);
    const ipDecimal = binaryToDecimal(ipBinary);
    return decimalToIp(ipDecimal + 1);
  };

  const calculateLastUsableIp = (broadcast, mask) => {
    if (mask === 0) return '255.255.255.254'; // Special case for /0
    const ipBinary = ipToBinary(broadcast);
    const ipDecimal = binaryToDecimal(ipBinary);
    return decimalToIp(ipDecimal - 1);
  };

  const ipToBinary = (ip) =>
    ip
      .split('.')
      .map((octet) => Number(octet).toString(2).padStart(8, '0'))
      .join('')
      .split('')
      .map(Number);

  const binaryToIp = (binary) =>
    binary
      .join('')
      .match(/.{8}/g)
      .map((octet) => parseInt(octet, 2))
      .join('.');

  const binaryToDecimal = (binary) => parseInt(binary.join(''), 2);

  const decimalToIp = (decimal) => {
    const octets = [];
    for (let i = 0; i < 4; i++) {
      octets.unshift(decimal & 255);
      decimal >>= 8;
    }
    return octets.join('.');
  };

  const getSubnetMaskBinary = (mask) => Array(32).fill(0).fill(1, 0, mask);

  return (
    <div>
      <h3>Subnet Calculator</h3>
      <div>
        <input
          type="text"
          placeholder="IP Address (e.g., 192.168.1.1)"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={useDevices}
              onChange={(e) => setUseDevices(e.target.checked)}
            />
            Use Number of Devices
          </label>
        </div>
        {!useDevices ? (
          <input
            type="number"
            placeholder="Subnet Mask (e.g., 24)"
            value={subnet}
            onChange={(e) => setSubnet(e.target.value)}
          />
        ) : (
          <input
            type="number"
            placeholder="Number of devices (e.g., 50)"
            value={devices}
            onChange={(e) => setDevices(e.target.value)}
          />
        )}
        <button onClick={calculateSubnet}>Calculate</button>
      </div>
      {results.networkAddress && (
        <div>
          <p>Network Address: {results.networkAddress}</p>
          <p>Broadcast Address: {results.broadcastAddress}</p>
          <p>First Usable IP: {results.firstIp}</p>
          <p>Last Usable IP: {results.lastIp}</p>
          <p>Subnet Mask: /{results.subnetMask}</p>
        </div>
      )}
    </div>
  );
};

export default SubnetCalculator;
