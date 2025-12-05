import { COLORS } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

const IconPaused = ({
  width = 7,
  height = 11,
  color = COLORS.primary,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 7 11" fill="none">
      <Path
        d="M0.75 0.75V9.75"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.75 0.75V9.75"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IconPaused;
