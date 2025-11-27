import { COLORS } from "@/constants/colors";
import { PropsWithChildren } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface IButton extends PressableProps {
  style?: ViewStyle | ViewStyle[];
  mode?: "default" | "btnIcon";
}

const ButtonUI: React.FC<PropsWithChildren<IButton>> = ({
  children,
  disabled,
  style,
  mode = "default",
  ...rest
}) => {
  const isModeIcon = mode === "btnIcon";

  return (
    <Pressable
      style={[
        isModeIcon ? styles.btnIcon : styles.btn,
        disabled && styles.btnDisabled,
        style,
      ]}
      disabled={disabled}
      {...rest}
    >
      {!isModeIcon && <Text style={styles.btnText}>{children}</Text>}
      {isModeIcon && <View>{children}</View>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#019875",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    width: "100%",
    height: 51,
    fontFamily: "Manrope-SemiBold",
  },
  btnIcon: {
    backgroundColor: COLORS.bgGray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontFamily: "Manrope-SemiBold",
  },
  btnDisabled: {
    backgroundColor: "#78807E",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default ButtonUI;
