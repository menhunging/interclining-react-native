import { Text as RNText, TextProps } from "react-native";

type CustomTextProps = TextProps & {
  fontWeight?:
    | "regular"
    | "bold"
    | "medium"
    | "semibold"
    | "light"
    | "extrabold";
};

const TextUI = ({
  fontWeight = "regular",
  style,
  ...props
}: CustomTextProps) => {
  const fontMap: Record<NonNullable<CustomTextProps["fontWeight"]>, string> = {
    regular: "Manrope-Regular",
    bold: "Manrope-Bold",
    medium: "Manrope-Medium",
    semibold: "Manrope-SemiBold",
    light: "Manrope-Light",
    extrabold: "Manrope-ExtraBold",
  };

  return (
    <RNText {...props} style={[{ fontFamily: fontMap[fontWeight] }, style]} />
  );
};

export default TextUI;
