import Svg, { Path } from "react-native-svg";

const IconArrowRight = ({ width = 8, height = 14, color = "#2B2A2A" }) => (
  <Svg width={width} height={height} viewBox="0 0 8 14" fill="none">
    <Path
      d="M0.75 12.75L6.60203 7.07842C6.64881 7.03597 6.68603 6.98499 6.71146 6.92855C6.73689 6.87211 6.75 6.81137 6.75 6.75C6.75 6.68863 6.73689 6.62789 6.71146 6.57145C6.68603 6.51501 6.64881 6.46403 6.60203 6.42158L0.749999 0.75"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IconArrowRight;
