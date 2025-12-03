import React from "react";
import Svg, { Path } from "react-native-svg";

const IconCheckCircle: React.FC<{ width?: number; height?: number }> = ({
  width = 18,
  height = 18,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
      <Path
        d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z"
        fill="white"
      />
      <Path
        d="M4.8457 10.3851L7.68417 12.6559C7.7604 12.7187 7.84966 12.7637 7.94546 12.7876C8.04127 12.8116 8.14121 12.8139 8.23801 12.7944C8.33574 12.776 8.42838 12.7369 8.50961 12.6795C8.59085 12.6222 8.65878 12.548 8.70878 12.4621L13.1534 4.84668"
        stroke="#019875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IconCheckCircle;
