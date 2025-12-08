import { COLORS } from "@/constants/colors";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import TextUI from "../Text/Text";

interface TabsProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ options, active, onChange }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsContainer}
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

export default Tabs;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 30,
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: COLORS.bgGray,
  },
  activeTab: {
    backgroundColor: COLORS.black,
  },
  text: {
    fontSize: 14,
    color: COLORS.black,
  },
  activeText: {
    color: COLORS.white,
    fontWeight: "500",
  },
});
