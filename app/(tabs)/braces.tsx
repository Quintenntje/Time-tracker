import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import CustomBottomSheet from "../../components/BottomSheet";
import BracesInput from "../../components/BracesInput";
import CustomButton from "../../components/Button";
import FixedToBottom from "../../components/FixedToBottom";
import PageLayout from "../../components/PageLayout";

interface BracesTime {
  amount: number;
  startDate: string;
  endDate: string;
  completed: boolean;
}

const Braces = () => {
  const colorScheme = useColorScheme();
  const [bracesTime, setBracesTime] = useState<BracesTime[]>([]);
  const [bracesCount, setBracesCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const loadBracesTime = async () => {
    const bracesTime = await AsyncStorage.getItem("bracesTime");

    if (bracesTime) {
      setBracesTime(JSON.parse(bracesTime));
    }
    console.log(bracesTime);
  };

  useEffect(() => {
    loadBracesTime();
  }, []);

  const generateBracesObjects = (amount: number) => {
    const braces = [];
    let currentDate = new Date();

    for (let i = 0; i < amount; i++) {
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 10);

      braces.push({
        amount: i,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        completed: false,
      });

      currentDate = new Date(endDate);
    }

    return braces;
  };

  const handleSave = () => {
    const newBracesObjects = generateBracesObjects(bracesCount);
    const updatedBracesTime = [...bracesTime, ...newBracesObjects];

    setBracesTime(updatedBracesTime);
    setBracesCount(0);
    setIsOpen(false);

    AsyncStorage.setItem("bracesTime", JSON.stringify(updatedBracesTime));
  };

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
          <BracesInput value={bracesCount} onChange={setBracesCount} />
          <CustomButton title="Save" variant="primary" onPress={handleSave} />
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
