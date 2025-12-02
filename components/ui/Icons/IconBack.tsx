import { COLORS } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

const IconBack = ({ width = 8, height = 15, color = COLORS.primary }) => (
  <Svg width={width} height={height} viewBox="0 0 8 15" fill="none">
    <Path
      d="M7.05152 0.75L0.901519 6.9C0.853688 6.94489 0.815565 6.99911 0.789505 7.05931C0.763445 7.1195 0.75 7.1844 0.75 7.25C0.75 7.3156 0.763445 7.3805 0.789505 7.44069C0.815565 7.50089 0.853688 7.55511 0.901519 7.6L7.05152 13.75"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IconBack;
