import TextUI from "@/components/ui/Text/Text";
import { COLORS } from "@/constants/colors";
import { StyleSheet, View } from "react-native";

const appeals = () => {
  return (
    <View style={styles.container}>
      <TextUI>Пока здесь ничего нет </TextUI>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default appeals;
