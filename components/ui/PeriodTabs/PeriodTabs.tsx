import { COLORS } from "@/constants/colors";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import TextUI from "../Text/Text";

interface PeriodTabsProps {
  active: "Сегодня" | "Неделя" | "Месяц";
  onChange: (value: string) => void;
}

const PeriodTabs: React.FC<PeriodTabsProps> = ({ active, onChange }) => {
  const options = ["Сегодня", "Неделя", "Месяц"];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false} // убираем полоску скролла
      contentContainerStyle={styles.periodScrollBlock}
    >
      {options.map((option) => (
        <Pressable
          key={option}
          style={[styles.tab, active === option && styles.activeTab]}
          onPress={() => onChange(option)}
        >
          <TextUI style={active === option ? styles.activeText : styles.text}>
            {option}
          </TextUI>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default PeriodTabs;

const styles = StyleSheet.create({
  periodScrollBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: COLORS.bgGray,
  },
  activeTab: {
    backgroundColor: COLORS.black,
    color: COLORS.white,
  },
  text: {
    fontSize: 14,
  },
  activeText: {
    color: COLORS.white,
  },
});
