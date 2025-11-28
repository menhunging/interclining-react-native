import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ObjectScreen() {
  const { id } = useLocalSearchParams(); // получаем id из URL

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Страница объекта с ID: {id}</Text>
    </View>
  );
}
