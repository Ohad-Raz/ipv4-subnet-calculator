import React, { useState } from 'react';

const BinaryConverter = () => {
  const [binary, setBinary] = useState('');
  const [decimal, setDecimal] = useState('');

  // Handle Binary Input (prevents leading dots and multiple consecutive dots)
  const handleBinaryChange = (value) => {
    if (!/^[01.]*$/.test(value)) return; // Allow only 0,1, and dots
    if (value.includes('..')) return; // Prevent multiple dots in a row
    if (value.startsWith('.')) return; // Prevent dot at the beginning

    const binaryOctets = value.split('.');
    if (binaryOctets.length > 4) return; // Maximum 4 octets allowed
    if (binaryOctets.some(octet => octet.length > 8)) return; // Max 8 bits per octet

    setBinary(value);
  };

  // Handle Decimal Input (prevents leading dots and multiple consecutive dots)
  const handleDecimalChange = (value) => {
    if (!/^[0-9.]*$/.test(value)) return; // Allow only numbers and dots
    if (value.includes('..')) return; // Prevent multiple dots in a row
    if (value.startsWith('.')) return; // Prevent dot at the beginning

    const decimalOctets = value.split('.');
    if (decimalOctets.length > 4) return; // Maximum 4 octets allowed

    const clampedOctets = decimalOctets.map(octet => {
      const num = parseInt(octet, 10);
      if (isNaN(num)) return ''; // Allow empty octets while typing
      return Math.min(Math.max(num, 0), 255); // Restrict 0-255
    });

    setDecimal(clampedOctets.join('.'));
  };

  // Convert Binary to Decimal (auto-completes missing octets)
  const convertBinaryToDecimal = () => {
    let binaryOctets = binary.split('.').filter(octet => octet !== '');

    while (binaryOctets.length < 4) {
      binaryOctets.push('00000000'); // Auto-fill missing octets
    }

    const decimalOctets = binaryOctets.map(octet =>
      parseInt(octet, 2).toString()
    );

    setDecimal(decimalOctets.join('.'));
  };

  // Convert Decimal to Binary (auto-completes missing octets)
  const convertDecimalToBinary = () => {
    let decimalOctets = decimal.split('.').filter(octet => octet !== '');

    while (decimalOctets.length < 4) {
      decimalOctets.push('0'); // Auto-fill missing octets
    }

    const binaryOctets = decimalOctets.map(octet =>
      parseInt(octet, 10).toString(2).padStart(8, '0')
    );

    setBinary(binaryOctets.join('.'));
  };

  return (
    <div>
      <h3>Binary to Decimal & Decimal to Binary (IPv4 Context)</h3>
      <div>
        <input
          type="text"
          placeholder="Binary (e.g., 11000000.10101000.00000001.00000001)"
          value={binary}
          onChange={(e) => handleBinaryChange(e.target.value)}
        />
        <button onClick={convertBinaryToDecimal}>Convert to Decimal</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Decimal (e.g., 192.168.1.1)"
          value={decimal}
          onChange={(e) => handleDecimalChange(e.target.value)}
        />
        <button onClick={convertDecimalToBinary}>Convert to Binary</button>
      </div>
      <p>Binary: {binary}</p>
      <p>Decimal: {decimal}</p>
    </div>
  );
};

export default BinaryConverter;
