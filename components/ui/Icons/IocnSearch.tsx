import React from "react";
import Svg, { Path } from "react-native-svg";

const IconSearch: React.FC<{
  width?: number;
  height?: number;
  color?: string;
}> = ({ width = 15, height = 15, color = "#6F7583" }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
      <Path
        d="M6.33696 12.1738C9.56062 12.1738 12.1739 9.56055 12.1739 6.33691C12.1739 3.11327 9.56062 0.5 6.33696 0.5C3.11329 0.5 0.5 3.11327 0.5 6.33691C0.5 9.56055 3.11329 12.1738 6.33696 12.1738Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.4994 14.4994L10.4609 10.4609"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IconSearch;
