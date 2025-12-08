import { COLORS } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

export const IconEdit = ({
  size = 13,
  color = COLORS.primary,
  strokeWidth = 1,
  ...props
}) => (
  <Svg width={size} height={size} viewBox="0 0 13 13" fill="none" {...props}>
    <Path
      d="M0.5 12.499H10.6484"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.03727 9.07812L3.26953 9.56542L3.73082 6.8221L9.93979 0.766931C10.0256 0.68235 10.1276 0.615216 10.24 0.569401C10.3524 0.523587 10.473 0.5 10.5948 0.5C10.7166 0.5 10.8372 0.523587 10.9496 0.569401C11.062 0.615216 11.1641 0.68235 11.2499 0.766931L12.2278 1.72349C12.3143 1.80738 12.3829 1.90718 12.4297 2.01715C12.4766 2.12712 12.5007 2.24507 12.5007 2.3642C12.5007 2.48332 12.4766 2.60127 12.4297 2.71124C12.3829 2.82121 12.3143 2.92102 12.2278 3.00491L6.03727 9.07812Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IconEdit;
