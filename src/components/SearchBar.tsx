import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { SIZES } from "../constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(
  ({ value, onChangeText, placeholder = "Search Products..." }) => {
    return (
      <View style={styles.container}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          style={styles.input}
        />
        {value.length > 0 ? (
          <TouchableOpacity onPress={() => onChangeText("")} style={styles.iconButton}>
            <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  input: {
    flex: 1,
    height: "100%",
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  iconButton: {
    padding: 4,
  },
  iconContainer: {
    padding: 4,
  },
});

export default SearchBar;
