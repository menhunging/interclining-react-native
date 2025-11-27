import { COLORS } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

const EyeOpenIcon = ({ width = 14, height = 14, color = COLORS.black }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 12" fill="none">
      <Path
        d="M12.2776 4.40039C12.6576 4.74039 12.9776 5.07039 13.2176 5.33039C13.3835 5.51414 13.4753 5.75287 13.4753 6.00039C13.4753 6.24791 13.3835 6.48664 13.2176 6.67039C12.1676 7.80039 9.77765 10.0004 6.98765 10.0004H6.58765"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.85764 9.13C2.69927 8.48125 1.65261 7.65067 0.757639 6.67C0.591799 6.48625 0.5 6.24752 0.5 6C0.5 5.75248 0.591799 5.51375 0.757639 5.33C1.80764 4.2 4.19764 2 6.98764 2C8.08741 2.02299 9.16375 2.32216 10.1176 2.87"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.4877 0.5L1.48767 11.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default EyeOpenIcon;
