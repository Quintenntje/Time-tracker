import React, { useState } from "react";
import { Switch, Text, View, useColorScheme } from "react-native";

interface ToggleCardProps {
  children: React.ReactNode;
  initialValue?: boolean;
  onToggle?: (value: boolean) => void;
}

const ToggleCard: React.FC<ToggleCardProps> = ({
  children,
  initialValue = false,
  onToggle,
}) => {
  const colorScheme = useColorScheme();
  const [isEnabled, setIsEnabled] = useState(initialValue);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onToggle?.(newValue);
  };

  return (
    <View
      className={`p-4 rounded-lg flex-row items-center justify-between mb-4 ${
        colorScheme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <Text
        className={`text-lg font-semibold flex-1 ${
          colorScheme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {children}
      </Text>
      <Switch
        value={isEnabled}
        onValueChange={toggleSwitch}
        trackColor={{
          false: colorScheme === "dark" ? "#374151" : "#D1D5DB",
          true: "#10B981",
        }}
        thumbColor={isEnabled ? "#FFFFFF" : "#9CA3AF"}
      />
    </View>
  );
};

export default ToggleCard;
