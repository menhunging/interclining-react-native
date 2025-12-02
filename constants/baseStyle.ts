import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const baseStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },

  block: {
    paddingHorizontal: 20,
  },

  caption: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
    marginTop: 30,
  },

  main: {
    fontFamily: "Manrope-Regular",
    fontSize: 16,
  },

  emptyText: {
    fontSize: 14,
    marginTop: -5,
    color: COLORS.primary,
    opacity: 0.5,
  },

  skeleton: {
    backgroundColor: COLORS.bgGray,
    borderRadius: 6,
  },
});

export const Fonts = StyleSheet.create({
  font300: {
    fontFamily: "Manrope-Light",
  },
  font400: {
    fontFamily: "Manrope-Regular",
  },
  font500: {
    fontFamily: "Manrope-Medium",
  },
  font600: {
    fontFamily: "Manrope-SemiBold",
  },
  font700: {
    fontFamily: "Manrope-Bold",
  },
  font800: {
    fontFamily: "Manrope-ExtraBold",
  },
});
