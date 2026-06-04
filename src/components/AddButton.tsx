import React from "react";
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Image } from "expo-image";
import IMAGE_MAP from "../constants/images";

interface AddButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const AddButton: React.FC<AddButtonProps> = React.memo(({ onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.addButton, style]}>
      <Image source={IMAGE_MAP.add} style={styles.image} contentFit="contain" transition={200} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default AddButton;
