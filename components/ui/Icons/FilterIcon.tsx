import { COLORS } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

const FilterIcon = ({ width = 14, height = 14, color = COLORS.primary }) => (
  <Svg width={width} height={height} viewBox="0 0 14 14" fill="none">
    <Path
      d="M13.5 0.5H0.5C0.500552 1.96356 0.994263 3.38424 1.90145 4.53274C2.80863 5.68123 4.07635 6.49053 5.5 6.83V13.5L8.5 11.5V6.83C9.92365 6.49053 11.1914 5.68123 12.0986 4.53274C13.0057 3.38424 13.4994 1.96356 13.5 0.5Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default FilterIcon;
