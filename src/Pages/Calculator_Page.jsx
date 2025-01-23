import React from 'react';
import Binary_Converter from '../Components/BinaryConverter/Binary_Converter';
import Subnet_Calculator from '../Components/SubnetCalculator/Subnet_Calculator';

const Calculator_Page = () => {
  return (
    <div>
      <Binary_Converter />
      <Subnet_Calculator />
    </div>
  );
};

export default Calculator_Page;
