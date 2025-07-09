import { registerBackgroundTask } from "@/utils/backgroundTimer";
import { registerForPushNotificationsAsync } from "@/utils/notificationSetup";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "./global.css";  
import * as Notifications from "expo-notifications";

export default function RootLayout() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  const colorScheme = useColorScheme();

  useEffect(() => {
    registerForPushNotificationsAsync();
    registerBackgroundTask();
  }, []);

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: "fade_from_bottom",
          }}
        />
      </Stack>
    </>
  );
}
