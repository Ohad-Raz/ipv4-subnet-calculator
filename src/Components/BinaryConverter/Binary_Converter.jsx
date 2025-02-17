import React, { useState } from 'react';

const BinaryConverter = () => {
  const [binary, setBinary] = useState('');
  const [decimal, setDecimal] = useState('');
  const [error, setError] = useState('');

  const handleBinaryChange = (value) => {
    // Prevent consecutive dots
    if (value.includes('..')) return;

    // Allow only binary digits (0,1) and dots
    if (!/^[01.]*$/.test(value)) {
      setError('Invalid input: Only 0s and 1s are allowed.');
      return;
    }

    const binaryOctets = value.split('.');
    if (binaryOctets.length > 4) {
      setError('Invalid input: Maximum 4 octets allowed.');
      return;
    }

    if (binaryOctets.some(octet => octet.length > 8)) {
      setError('Invalid input: Each octet must have at most 8 bits.');
      return;
    }

    setError('');
    setBinary(value);
  };

  const handleDecimalChange = (value) => {
    // Prevent consecutive dots
    if (value.includes('..')) return;

    // Allow only numbers and dots
    if (!/^[0-9.]*$/.test(value)) {
      setError('Invalid input: Only numbers allowed.');
      return;
    }

    const decimalOctets = value.split('.');
    if (decimalOctets.length > 4) {
      setError('Invalid input: Maximum 4 octets allowed.');
      return;
    }

    const clampedOctets = decimalOctets.map(octet => {
      const num = parseInt(octet, 10);
      if (isNaN(num)) return '';
      return Math.min(Math.max(num, 0), 255);
    });

    setError('');
    setDecimal(clampedOctets.join('.'));
  };

  const convertBinaryToDecimal = () => {
    const binaryOctets = binary.split('.');
    
    // Ensure we have exactly 4 octets, pad if necessary
    while (binaryOctets.length < 4) {
      binaryOctets.push('00000000');
    }

    if (binaryOctets.every(octet => /^[01]{1,8}$/.test(octet))) {
      const decimalOctets = binaryOctets.map(octet => parseInt(octet, 2).toString());
      setDecimal(decimalOctets.join('.'));
    } else {
      setError('Invalid action. Provide 1-4 valid binary octets.');
    }
  };

  const convertDecimalToBinary = () => {
    const decimalOctets = decimal.split('.');

    // Ensure we have exactly 4 octets, pad with zeros
    while (decimalOctets.length < 4) {
      decimalOctets.push('0');
    }

    if (
      decimalOctets.every(
        octet => /^\d{1,3}$/.test(octet) && parseInt(octet) >= 0 && parseInt(octet) <= 255
      )
    ) {
      const binaryOctets = decimalOctets.map(octet =>
        parseInt(octet, 10).toString(2).padStart(8, '0')
      );
      setBinary(binaryOctets.join('.'));
    } else {
      setError('Invalid action. Provide exactly 4 decimal octets.');
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
      {error && <p className="error">{error}</p>}
      <p>Binary: {binary}</p>
      <p>Decimal: {decimal}</p>
    </div>
  );
};

export default BinaryConverter;
