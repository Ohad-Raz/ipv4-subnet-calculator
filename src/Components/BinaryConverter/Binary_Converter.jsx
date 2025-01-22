import React, { useState } from 'react';

const BinaryConverter = () => {
  const [binary, setBinary] = useState('');
  const [decimal, setDecimal] = useState('');

  const isValidBinaryOctet = (octet) => /^[01]{1,8}$/.test(octet); // Validate binary octets (1 to 8 bits)

  const handleBinaryToDecimal = () => {
    const binaryOctets = binary.split('.');
    if (binaryOctets.length >= 1 && binaryOctets.length <= 4 && binaryOctets.every(isValidBinaryOctet)) {
      const decimalOctets = binaryOctets.map((octet) => parseInt(octet, 2));
      setDecimal(decimalOctets.join('.'));
    } else {
      alert('Invalid binary input. Please provide 1 to 4 octets of binary (e.g., 11000000.10101000.00000001.00000001).');
    }
  };

  const isValidDecimalOctet = (octet) => /^\d{1,3}$/.test(octet) && parseInt(octet) >= 0 && parseInt(octet) <= 255;

  const handleDecimalToBinary = () => {
    const decimalOctets = decimal.split('.');
    if (decimalOctets.length >= 1 && decimalOctets.length <= 4 && decimalOctets.every(isValidDecimalOctet)) {
      const binaryOctets = decimalOctets.map((octet) =>
        parseInt(octet, 10).toString(2).padStart(8, '0') // Convert to binary and pad to 8 bits
      );
      setBinary(binaryOctets.join('.'));
    } else {
      alert('Invalid decimal input. Please provide 1 to 4 octets of decimal (e.g., 192.168.1.1).');
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
          onChange={(e) => setBinary(e.target.value)}
        />
        <button onClick={handleBinaryToDecimal}>Convert to Decimal</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Decimal (e.g., 192.168.1.1)"
          value={decimal}
          onChange={(e) => setDecimal(e.target.value)}
        />
        <button onClick={handleDecimalToBinary}>Convert to Binary</button>
      </div>
      <p>Binary: {binary}</p>
      <p>Decimal: {decimal}</p>
    </div>
  );
};

export default BinaryConverter;
