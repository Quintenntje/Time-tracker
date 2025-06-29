import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface SettingsItemProps {
  title: string;
  iconName: string;
  onPress?: () => void;
  showChevron?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  iconName,
  onPress,
  showChevron = true,
}) => {
  const colorScheme = useColorScheme();

  const ItemContent = (
    <View
      className={`flex-row items-center justify-between w-full py-6 border-t border-b ${
        colorScheme === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <View className="flex-row items-center">
        <Icon
          name={iconName}
          size={28}
          color={colorScheme === "dark" ? "#D1D5DB" : "#374151"}
        />
        <Text
          className={`text-2xl ml-3 ${
            colorScheme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {title}
        </Text>
      </View>
      {showChevron && (
        <Icon
          name="chevron-forward-outline"
          size={28}
          color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {ItemContent}
      </TouchableOpacity>
    );
  }

  return ItemContent;
};

export default SettingsItem;
