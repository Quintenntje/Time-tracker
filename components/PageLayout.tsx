import React from "react";
import { View, useColorScheme } from "react-native";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const colorScheme = useColorScheme();

  return (
    <View
      className={`flex-1 overflow-hidden ${
        colorScheme === "dark" ? "bg-gray-900" : "bg-white"
      } `}
    >
      <View className="p-4 mt-20">{children}</View>
    </View>
  );
};

export default PageLayout;
