import React, { useState } from 'react';

const BinaryConverter = () => {
  const [binary, setBinary] = useState('');
  const [decimal, setDecimal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBinaryChange = (value) => {
    if (!/^[01.]*$/.test(value)) return;
    if (value.includes('..')) return;
    if (value.startsWith('.')) return;

    const binaryOctets = value.split('.');
    if (binaryOctets.length > 4) return;
    if (binaryOctets.some(octet => octet.length > 8)) return;

    setBinary(value);
  };

  const handleDecimalChange = (value) => {
    if (!/^[0-9.]*$/.test(value)) return;
    if (value.includes('..')) return;
    if (value.startsWith('.')) return;

    const decimalOctets = value.split('.');
    if (decimalOctets.length > 4) return;

    const clampedOctets = decimalOctets.map(octet => {
      const num = parseInt(octet, 10);
      if (isNaN(num)) return '';
      return Math.min(Math.max(num, 0), 255);
    });

    setDecimal(clampedOctets.join('.'));
  };

  const convertBinaryToDecimal = () => {
    setLoading(true);
    setTimeout(() => {
      let binaryOctets = binary.split('.').filter(octet => octet !== '');
      while (binaryOctets.length < 4) binaryOctets.push('00000000');

      const decimalOctets = binaryOctets.map(octet => parseInt(octet, 2).toString());
      setDecimal(decimalOctets.join('.'));
      setBinary(''); // Clear input
      setLoading(false);
    }, 1000); // 1-second delay
  };

  const convertDecimalToBinary = () => {
    setLoading(true);
    setTimeout(() => {
      let decimalOctets = decimal.split('.').filter(octet => octet !== '');
      while (decimalOctets.length < 4) decimalOctets.push('0');

      const binaryOctets = decimalOctets.map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'));
      setBinary(binaryOctets.join('.'));
      setDecimal(''); // Clear input
      setLoading(false);
    }, 1000); // 1-second delay
  };

  return (
    <div className="container">
      <h3>Binary to Decimal & Decimal to Binary (IPv4 Context)</h3>

      <div className="input-group">
        <input
          type="text"
          placeholder="Binary (e.g., 11000000.10101000.00000001.00000001)"
          value={binary}
          onChange={(e) => handleBinaryChange(e.target.value)}
          disabled={loading}
        />
        <button onClick={convertBinaryToDecimal} disabled={loading}>
          {loading ? 'Converting...' : 'Convert to Decimal'}
        </button>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Decimal (e.g., 192.168.1.1)"
          value={decimal}
          onChange={(e) => handleDecimalChange(e.target.value)}
          disabled={loading}
        />
        <button onClick={convertDecimalToBinary} disabled={loading}>
          {loading ? 'Converting...' : 'Convert to Binary'}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <h4>Binary: {binary}</h4>
          <h4>Decimal: {decimal}</h4>
        </>
      )}
    </div>
  );
};

export default BinaryConverter;
