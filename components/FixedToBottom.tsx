import React from "react";
import { View, useColorScheme } from "react-native";

interface PageLayoutProps {
  children: React.ReactNode;
}

const FixedToBottom: React.FC<PageLayoutProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  return (
    <View
      className={`fixed bottom-0 left-0 w-full p-4 overflow-hidden ${
        colorScheme === "dark" ? "bg-gray-900" : "bg-white"
      } `}
    >
      {children}
    </View>
  );
};

export default FixedToBottom;
