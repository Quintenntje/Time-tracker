import { router } from "expo-router";
import { useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import CustomBottomSheet from "../../components/BottomSheet";
import PageLayout from "../../components/PageLayout";
import SettingsItem from "../../components/SettingsItem";

const Settings = () => {
  const colorScheme = useColorScheme();
  const [isPrivacySheetOpen, setIsPrivacySheetOpen] = useState(false);

  const TogglePrivacySheet = () => {
    setIsPrivacySheetOpen(!isPrivacySheetOpen);
  }

  return (
    <>
      <PageLayout>
        <Text
          className={`text-4xl font-semibold   ${
            colorScheme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Settings
        </Text>
        <View className="mt-12">
          <SettingsItem
            title="Security Options"
            iconName="lock-closed-outline"
            onPress={() => router.push("/security")}
          />
          <SettingsItem
            title="Alarm"
            iconName="notifications-outline"
            onPress={() => router.push("/alarm")}
          />
          <SettingsItem
            title="Privacy"
            iconName="shield-outline"
            onPress={() => TogglePrivacySheet()}
          />
          <SettingsItem
            title="About"
            iconName="information-circle-outline"
            onPress={() => console.log("About pressed")}
          />
        </View>
      </PageLayout>

      <CustomBottomSheet
        isOpen={isPrivacySheetOpen}
        onClose={() => setIsPrivacySheetOpen(false)}
      >
        <Text className="text-lg font-semibold">Privacy Settings</Text>
        <Text className="mt-2 text-gray-600">
          Manage your privacy settings here.
        </Text>
      </CustomBottomSheet>
    </>
  );
};

export default Settings;
