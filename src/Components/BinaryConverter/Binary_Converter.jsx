import React, { useState } from 'react';

const BinaryConverter = () => {
  const [binary, setBinary] = useState('');
  const [decimal, setDecimal] = useState('');

  const handleBinaryToDecimal = () => {
    if (/^[01]+$/.test(binary)) {
      setDecimal(parseInt(binary, 2));
    } else {
      alert('Invalid binary input');
    }
  };

  const handleDecimalToBinary = () => {
    if (!isNaN(decimal)) {
      setBinary(Number(decimal).toString(2));
    } else {
      alert('Invalid decimal input');
    }
  };

  return (
    <div>
      <h3>Binary to Decimal & Decimal to Binary</h3>
      <div>
        <input
          type="text"
          placeholder="Binary"
          value={binary}
          onChange={(e) => setBinary(e.target.value)}
        />
        <button onClick={handleBinaryToDecimal}>Convert to Decimal</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Decimal"
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
