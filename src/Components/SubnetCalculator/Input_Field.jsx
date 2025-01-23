import React from 'react';
import './Input_Field.css';
import Error_Message from './Error_Message';

const Input_Field = ({ label, value, onChange, type = 'text', placeholder, error }) => {
  const handleInputChange = (e) => {
    const newValue = e.target.value;

    // For subnet mask and IP, ensure only valid numbers/inputs are allowed
    if (type === 'number' && newValue !== '') {
      if (!isNaN(newValue) && Number(newValue) >= 0) {
        onChange(newValue);
      }
    } else {
      onChange(newValue); // Allow for text inputs
    }
  };

  return (
    <div className="input-field">
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
      />
      <Error_Message message={error} />
    </div>
  );
};

export default Input_Field;
