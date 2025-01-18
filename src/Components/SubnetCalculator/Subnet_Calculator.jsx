import React, { useState } from 'react';

const SubnetCalculator = () => {
  const [ip, setIp] = useState('');
  const [subnet, setSubnet] = useState('');
  const [results, setResults] = useState({});

  const calculateSubnet = () => {
    try {
      const [network, prefix] = ip.split('/');
      const subnetMask = parseInt(subnet) || parseInt(prefix);

      if (!validateIP(network) || subnetMask < 0 || subnetMask > 32) {
        throw new Error('Invalid IP or subnet mask');
      }

      const networkAddress = calculateNetworkAddress(network, subnetMask);
      const broadcastAddress = calculateBroadcastAddress(networkAddress, subnetMask);
      const firstIp = calculateFirstUsableIp(networkAddress, subnetMask);
      const lastIp = calculateLastUsableIp(broadcastAddress, subnetMask);

      setResults({ networkAddress, broadcastAddress, firstIp, lastIp });
    } catch (err) {
      alert(err.message);
    }
  };

  const validateIP = (ip) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/; // Basic IPv4 regex validation
    if (!ipRegex.test(ip)) return false;

    const octets = ip.split('.').map(Number);
    return octets.every((octet) => octet >= 0 && octet <= 255);
  };

  const calculateNetworkAddress = (ip, mask) => {
    const ipBinary = ipToBinary(ip);
    const maskBinary = getSubnetMaskBinary(mask);
    const networkBinary = ipBinary.map((bit, i) => bit & maskBinary[i]);
    return binaryToIp(networkBinary);
  };

  const calculateBroadcastAddress = (network, mask) => {
    const maskBinary = getSubnetMaskBinary(mask).map((bit) => (bit === 1 ? 0 : 1));
    const networkBinary = ipToBinary(network);
    const broadcastBinary = networkBinary.map((bit, i) => bit | maskBinary[i]);
    return binaryToIp(broadcastBinary);
  };

  const calculateFirstUsableIp = (network, mask) => {
    if (mask === 32) return network; // For /32, only one usable IP
    if (mask === 31) return network; // For /31, both IPs are usable
    const ipBinary = ipToBinary(network);
    const ipDecimal = binaryToDecimal(ipBinary);
    return decimalToIp(ipDecimal + 1);
  };

  const calculateLastUsableIp = (broadcast, mask) => {
    if (mask === 32) return broadcast; // For /32, only one usable IP
    if (mask === 31) return broadcast; // For /31, both IPs are usable
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
      <input
        type="text"
        placeholder="IP Address (e.g., 192.168.1.1/24)"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />
      <input
        type="number"
        placeholder="Subnet Mask (e.g., 24)"
        value={subnet}
        onChange={(e) => setSubnet(e.target.value)}
      />
      <button onClick={calculateSubnet}>Calculate</button>
      {results.networkAddress && (
        <div>
          <p>Network Address: {results.networkAddress}</p>
          <p>Broadcast Address: {results.broadcastAddress}</p>
          <p>First Usable IP: {results.firstIp}</p>
          <p>Last Usable IP: {results.lastIp}</p>
        </div>
      )}
    </div>
  );
};

export default SubnetCalculator;
