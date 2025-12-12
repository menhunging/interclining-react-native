import { COLORS } from "@/constants/colors";
import { IPausePhoto } from "@/types/typesMobile/tasks";
import { getFullPhotoUrl } from "@/utils/getFullPhotoUrl";
import React, { useState } from "react";
import { Dimensions, Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface ImageSliderProps {
  photos: IPausePhoto[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return null;
  }

  const handleScroll = (event: any) => {
    const slideSize = screenWidth - 40;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  const handleImagePress = (index: number) => {
    setSelectedPhotoIndex(index);
    setModalVisible(true);
  };

  const handleModalScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setSelectedPhotoIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.scrollView}
        onMomentumScrollEnd={handleScroll}
      >
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={photo.id}
            style={styles.imageContainer}
            onPress={() => handleImagePress(index)}
          >
            <Image
              source={{ uri: getFullPhotoUrl(photo.photo) }}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Индикаторы */}
      <View style={styles.indicatorContainer}>
        {photos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      {/* Полноэкранный просмотр */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}
          >
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleModalScroll}
              contentOffset={{ x: selectedPhotoIndex * screenWidth, y: 0 }}
              style={styles.modalScrollView}
            >
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.modalImageContainer}
                  onPress={() => setModalVisible(false)}
                >
                  <Image
                    source={{ uri: getFullPhotoUrl(photo.photo) }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  scrollView: {
    height: 152,
    borderRadius: 10,
  },
  imageContainer: {
    width: screenWidth - 40, // ширина экрана минус padding контейнера
    backgroundColor: COLORS.bgGray,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: COLORS.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalScrollView: {
    flex: 1,
  },
  modalImageContainer: {
    width: screenWidth,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: screenWidth,
    height: "80%",
  },
});

export default ImageSlider;
