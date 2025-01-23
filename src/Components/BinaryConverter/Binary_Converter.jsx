import React, { useState } from 'react';

const BinaryConverter = () => {
  const [binary, setBinary] = useState('');
  const [decimal, setDecimal] = useState('');

  const handleBinaryChange = (value) => {
    const binaryOctets = value.split('.');
    if (binaryOctets.every((octet) => /^[01]{0,8}$/.test(octet))) {
      setBinary(value);
    }
  };

  const handleDecimalChange = (value) => {
    const decimalOctets = value.split('.');
    const clampedOctets = decimalOctets.map((octet) => {
      const num = parseInt(octet, 10);
      if (isNaN(num)) return ''; // Allow empty octets during typing
      return Math.min(Math.max(num, 0), 255); // Clamp to 0-255
    });
    setDecimal(clampedOctets.join('.'));
  };

  const convertBinaryToDecimal = () => {
    const binaryOctets = binary.split('.');
    if (binaryOctets.every((octet) => /^[01]{1,8}$/.test(octet))) {
      const decimalOctets = binaryOctets.map((octet) =>
        parseInt(octet, 2).toString()
      );
      setDecimal(decimalOctets.join('.'));
    }
  };

  const convertDecimalToBinary = () => {
    const decimalOctets = decimal.split('.');
    if (
      decimalOctets.every(
        (octet) =>
          /^\d{1,3}$/.test(octet) &&
          parseInt(octet) >= 0 &&
          parseInt(octet) <= 255
      )
    ) {
      const binaryOctets = decimalOctets.map((octet) =>
        parseInt(octet, 10).toString(2).padStart(8, '0')
      );
      setBinary(binaryOctets.join('.'));
    }
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
