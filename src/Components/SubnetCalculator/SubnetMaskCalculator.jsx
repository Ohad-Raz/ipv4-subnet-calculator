import React, { useState } from "react";
import {
  calculateNetworkAddress,
  calculateBroadcastAddress,
  calculateFirstUsableIp,
  calculateLastUsableIp,
  prefixToDecimal,
  validateIP
} from "./Subnet_Logic";

const SubnetMaskCalculator = ({ onResultsUpdate }) => {
  const [ip, setIp] = useState("");
  const [subnet, setSubnet] = useState("");
  const [errors, setErrors] = useState({});

  const handleIPChange = (value) => {
    let cleanedValue = value.replace(/[^0-9.]/g, "").replace(/\.{2,}/g, ".");
    const octets = cleanedValue.split(".");

    if (octets.length > 4) {
      setErrors({ ip: "Invalid action: Only 4 octets allowed." });
      return;
    }

    const processedOctets = octets.map((octet) => {
      if (octet === "") return "";
      let num = parseInt(octet, 10);
      if (isNaN(num)) return "";
      return num > 255 ? "255" : String(num);
    });

    setErrors({});
    setIp(processedOctets.join("."));
  };

  const handleSubnetChange = (value) => {
    // Remove non-numeric characters
    let cleanedValue = value.replace(/[^0-9]/g, '');
    let num = parseInt(cleanedValue, 10);
  
    if (isNaN(num) || cleanedValue === '') {
      setErrors({ subnet: "Please enter a valid subnet mask (0 - 32)." });
      setSubnet(""); // Clear invalid input
      return;
    }
  
    if (num > 32) {
      setErrors({ subnet: "Subnet Mask must be between 0 and 32." });
      num = 32;
    } else {
      setErrors({});
    }
  
    setSubnet(num.toString());
  };
  

  const calculateSubnet = () => {
    if (!validateIP(ip)) {
        setErrors({ ip: "Invalid IP Address format. Provide a valid IPv4 address." });
        return;
    }

    if (!subnet) {  // Stop calculation if subnet is empty
        setErrors({ subnet: "Please enter a valid subnet mask." });
        return;
    }

    const networkAddress = calculateNetworkAddress(ip, subnet);
    const broadcastAddress = calculateBroadcastAddress(networkAddress, subnet);

    let firstIp, lastIp;
    
    if (subnet === "32") {
        firstIp = "N/A"; 
        lastIp = "N/A";
    } else if (subnet === "31") {
        firstIp = networkAddress; 
        lastIp = broadcastAddress;
    } else {
        firstIp = calculateFirstUsableIp(networkAddress, subnet);
        lastIp = calculateLastUsableIp(broadcastAddress, subnet);
    }

    const decimalSubnetMask = prefixToDecimal(subnet);

    onResultsUpdate({
        networkAddress,
        broadcastAddress,
        firstIp,
        lastIp,
        subnetMask: subnet,
        decimalSubnetMask,
    });
};


  return (
    <div className="container">
      <div className="section">
        <div className="input-group">
          <label>IP Address:</label>
          <input type="text" placeholder="e.g., 192.168.0.1" value={ip} onChange={(e) => handleIPChange(e.target.value)} />
          {errors.ip && <p className="error">{errors.ip}</p>}
        </div>

        <div className="input-group">
          <label>Subnet Mask:</label>
          <input type="number" placeholder="e.g., 24" value={subnet} onChange={(e) => handleSubnetChange(e.target.value)} />
          {errors.subnet && <p className="error">{errors.subnet}</p>}
        </div>
      </div>

      <button onClick={calculateSubnet}>Calculate</button>
    </div>
  );
};

export default SubnetMaskCalculator;
