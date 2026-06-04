import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import COLORS from "../constants/colors";
import { SIZES, SHADOWS } from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = React.memo(
  ({ title, onPress, style, textStyle, loading = false, disabled = false }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button,
          disabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    borderRadius: SIZES.radiusRound,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.light,
  },
  disabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.5,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 1,
    fontWeight: "600",
  },
});

export default Button;
