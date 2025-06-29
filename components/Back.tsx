import { router } from "expo-router";
import React from "react";
import { Text, View, useColorScheme } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface PageLayoutProps {
  children: React.ReactNode;
}

const Back: React.FC<PageLayoutProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  return (
    <View className="flex-row items-center gap-4">
      <Icon
      name="arrow-back-outline"
      size={28}
      color={colorScheme === "dark" ? "white" : "black"}
      onPress={() => {
        router.back();
      }}
      />
      <Text className={`text-4xl font-semibold  ${
            colorScheme === "dark" ? "text-gray-50" : "text-gray-900"
          }`}>{children}</Text>
    </View>
  );
};

export default Back;
