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
      const firstIp = calculateFirstUsableIp(networkAddress);
      const lastIp = calculateLastUsableIp(broadcastAddress);

      setResults({ networkAddress, broadcastAddress, firstIp, lastIp });
    } catch (err) {
      alert(err.message);
    }
  };

  const validateIP = (ip) => {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
  };

  const calculateNetworkAddress = (ip, mask) => {
    // Implement logic to calculate network address
    return ip; // Placeholder
  };

  const calculateBroadcastAddress = (network, mask) => {
    // Implement logic to calculate broadcast address
    return network; // Placeholder
  };

  const calculateFirstUsableIp = (network) => {
    // Implement logic for first usable IP
    return network; // Placeholder
  };

  const calculateLastUsableIp = (broadcast) => {
    // Implement logic for last usable IP
    return broadcast; // Placeholder
  };

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
