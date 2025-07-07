import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import CustomBottomSheet from "../../components/BottomSheet";
import CustomButton from "../../components/Button";
import FixedToBottom from "../../components/FixedToBottom";
import PageLayout from "../../components/PageLayout";

interface BracesTime {
  time: number;
  date: string;
}

const Braces = () => {
  const colorScheme = useColorScheme();
  const [bracesTime, setBracesTime] = useState<BracesTime[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadBracesTime = async () => {
    const bracesTime = await AsyncStorage.getItem("bracesTime");
    if (bracesTime) {
      setBracesTime(JSON.parse(bracesTime));
    }
  };

  useEffect(() => {
    loadBracesTime();
  }, []);

  return (
    <>
      <PageLayout>
        <Text
          className={`text-4xl font-semibold   ${
            colorScheme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Braces
        </Text>

        <View className="mt-8">
          {bracesTime.length === 0 && (
            <Text
              className={`text-xl font-semibold ${
                colorScheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              No braces found, add the total braces to get started
            </Text>
          )}
        </View>
      </PageLayout>
      {bracesTime.length === 0 && (
        <FixedToBottom>
          <CustomButton
            title="Add Braces Time"
            onPress={() => setIsOpen(true)}
          />
        </FixedToBottom>
      )}

      <CustomBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <View className="flex gap-4">
          <CustomButton
            title="Save"
            variant="primary"
            onPress={() => setIsOpen(false)}
          />
          <CustomButton
            title="Cancel"
            variant="secondary"
            onPress={() => setIsOpen(false)}
          />
        </View>
      </CustomBottomSheet>
    </>
  );
};

export default Braces;
