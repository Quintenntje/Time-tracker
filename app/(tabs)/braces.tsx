import { BracesTime } from "@/types/BracesTime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, Text, useColorScheme, View } from "react-native";
import CustomBottomSheet from "../../components/BottomSheet";
import BracesInput from "../../components/BracesInput";
import CustomButton from "../../components/Button";
import FixedToBottom from "../../components/FixedToBottom";
import PageLayout from "../../components/PageLayout";

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
        amount: i + 1,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        completed: false,
      });

      currentDate = new Date(endDate);
    }

    return braces;
  };

  const getDaysTillCompletion = () => {
    const braces = bracesTime.filter((brace) => !brace.completed);
    const daysTillCompletion = braces.reduce((acc, brace) => {
      const startDate = new Date(brace.startDate);
      const endDate = new Date(brace.endDate);
      const timeDiff = endDate.getTime() - startDate.getTime();
      return acc + timeDiff;
    }, 0);

    return Math.ceil(daysTillCompletion / (1000 * 60 * 60 * 24));
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
          {bracesTime.length > 0 && (
            <>
              <Text
                className={`text-xl font-semibold ${
                  colorScheme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Total braces: {bracesTime.length}
              </Text>
              <Text
                className={`text-4xl font-semibold mt-8 ${
                  colorScheme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Days till completion: {getDaysTillCompletion()}
              </Text>
            </>
          )}
        </View>
        <FlatList
          data={bracesTime}
          keyExtractor={(item, index) => `brace-${index}-${item.amount}`}
          renderItem={({ item }) => (
            <View
              className={`p-4 rounded-lg border-2 mb-3 ${
                colorScheme === "dark"
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-300 bg-white"
              } ${item.completed ? "opacity-50" : ""}`}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text
                    className={`text-lg font-semibold ${
                      colorScheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Brace #{item.amount}
                  </Text>
                  <Text
                    className={`text-sm ${
                      colorScheme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Amount: {item.amount}
                  </Text>
                  <Text
                    className={`text-sm ${
                      colorScheme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Start: {new Date(item.startDate).toLocaleDateString()}
                  </Text>
                  <Text
                    className={`text-sm ${
                      colorScheme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    End: {new Date(item.endDate).toLocaleDateString()}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    item.completed ? "bg-green-500" : "bg-blue-500"
                  }`}
                >
                  <Text className="text-white text-sm font-medium">
                    {item.completed ? "Completed" : "Active"}
                  </Text>
                </View>
              </View>
            </View>
          )}
          className="mt-4"
          showsVerticalScrollIndicator={false}
        />
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
