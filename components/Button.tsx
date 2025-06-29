import React from "react";
import { Text, TouchableOpacity, useColorScheme } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  className = "",
  accessibilityLabel,
}) => {
  const colorScheme = useColorScheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return disabled ? "bg-blue-400" : "bg-blue-600 active:bg-blue-700";
      case "secondary":
        return disabled ? "bg-gray-800" : "bg-transparent active:bg-gray-800";
      case "danger":
        return disabled ? "bg-red-400" : "bg-red-600 active:bg-red-700";
      default:
        return "bg-blue-600";
    }
  };

  const getTextColor = () => {
    if (variant === "secondary") {
      return colorScheme === "dark" ? "text-white" : "text-gray-900";
    }
    return "text-white";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel || title}
      className={`
        px-6 py-3 rounded-lg items-center justify-center
        ${getVariantStyles()}
        ${disabled ? "opacity-50" : ""}
        ${className}
      `}
    >
      <Text className={`${getTextColor()} font-semibold text-xl`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
