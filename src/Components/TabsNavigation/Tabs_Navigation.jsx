import React, { useState } from "react";
import BinaryConverter from "../BinaryConverter/Binary_Converter";
import SubnetCalculator from "../SubnetCalculator/Subnet_Calculator";
// import "../Styles/styles.css"; // Ensure styles are applied
import "./TabsNavigation.css"

const TabsNavigation = () => {
  const [activeTab, setActiveTab] = useState("subnet");

  return (
    <div className="tabs-container">
      {/* Tabs Navigation */}
      <div className="tabs">
        <button 
          className={activeTab === "subnet" ? "active-tab" : ""}
          onClick={() => setActiveTab("subnet")}
        >
          Subnet Calculator
        </button>
        <button 
          className={activeTab === "converter" ? "active-tab" : ""}
          onClick={() => setActiveTab("converter")}
        >
            Binary & Decimal Converter
        </button>
      </div>

      {/* Conditionally Render the Selected Component */}
      <div className="tab-content">
        {activeTab === "subnet" && <SubnetCalculator />}
        {activeTab === "converter" && <BinaryConverter />}
      </div>
    </div>
  );
};

export default TabsNavigation;
