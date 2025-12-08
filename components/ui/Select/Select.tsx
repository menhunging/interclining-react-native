import { COLORS } from "@/constants/colors";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import IconArrowRight from "../Icons/IconArrowRight";
import TextUI from "../Text/Text";

const { height: screenHeight } = Dimensions.get("window");

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  caption: string;
  options: SelectOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: any;
}

const Select: React.FC<SelectProps> = ({
  caption,
  options,
  selectedValue,
  onValueChange,
  placeholder = "Выберите значение",
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => handleSelect(item.value)}
    >
      <TextUI style={styles.optionText}>{item.label}</TextUI>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={[style, styles.selectButton]}
        onPress={() => setModalVisible(true)}
      >
        <TextUI style={styles.fieldLabel} fontWeight="regular">
          {caption}
        </TextUI>
        <TextUI fontWeight="medium" style={[styles.selectedText]}>
          {selectedOption ? selectedOption.label : placeholder}
        </TextUI>
        <View style={styles.arrow}>
          <IconArrowRight />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <TextUI style={styles.closeButtonText}>✕</TextUI>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={renderOption}
              showsVerticalScrollIndicator={false}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.bgGray,
    borderRadius: 8,
    overflow: "hidden",
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  arrow: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.7,
    minHeight: screenHeight * 0.3,
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 }, // соответствует 0px 2px
    shadowOpacity: 0.5, // прозрачность (#0000001A ≈ 10%)
    shadowRadius: 8, // радиус размытия
    // Android
    elevation: 4, // подбирается экспериментально (≈ shadowRadius)
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgGray,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.black,
  },
  optionsList: {
    paddingHorizontal: 16,
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgGray,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.black,
  },

  fieldLabel: {
    width: "100%",
    fontSize: 14,
    color: COLORS.tabNotActiveColor,
  },
});

export default Select;
