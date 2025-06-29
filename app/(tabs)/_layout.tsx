import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const TabsLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "#60A5FA" : "#007AFF",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#9CA3AF" : "#8E8E93",
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
          borderTopColor: colorScheme === "dark" ? "#374151" : "#E5E7EB",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calendar",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="medication"
        options={{
          title: "Medication",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="medical-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
