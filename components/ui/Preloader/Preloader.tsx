import { ActivityIndicator, StyleSheet } from "react-native";

const Preloader = () => {
  return (
    <ActivityIndicator style={styles.prealoder} size={"small"} color="#000" />
  );
};

const styles = StyleSheet.create({
  prealoder: {
    flex: 1,
  },
});

export default Preloader;
