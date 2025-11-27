import { COLORS } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

const EyeIcon = ({ width = 14, height = 14, color = COLORS.black }) => (
  <Svg width={width} height={height} viewBox="0 0 14 9" fill="none">
    <Path
      d="M13.2176 3.83C13.3835 4.01375 13.4753 4.25248 13.4753 4.5C13.4753 4.74752 13.3835 4.98625 13.2176 5.17C12.1676 6.3 9.77764 8.5 6.98764 8.5C4.19764 8.5 1.80764 6.3 0.757639 5.17C0.591799 4.98625 0.5 4.74752 0.5 4.5C0.5 4.25248 0.591799 4.01375 0.757639 3.83C1.80764 2.7 4.19764 0.5 6.98764 0.5C9.77764 0.5 12.1676 2.7 13.2176 3.83Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.98755 6.5C8.09212 6.5 8.98755 5.60457 8.98755 4.5C8.98755 3.39543 8.09212 2.5 6.98755 2.5C5.88298 2.5 4.98755 3.39543 4.98755 4.5C4.98755 5.60457 5.88298 6.5 6.98755 6.5Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default EyeIcon;
