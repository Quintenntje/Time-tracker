import { useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import CustomButton from "../../components/Button";
import FixedToBottom from "../../components/FixedToBottom";
import PageLayout from "../../components/PageLayout";

export default function Index() {
  const colorScheme = useColorScheme();
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const getSecondsUntilMidnight = () => {
    const now: number = new Date();
    const midnight: number = new Date();
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight - now) / 1000);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  function handleStartTimer() {
    setIsTimerRunning(true);
    setTime(getSecondsUntilMidnight());
  }

  return (
    <>
      <PageLayout>
        <Text
          className={`font-bold text-4xl ${
            colorScheme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome
        </Text>
        <View className="flex items-center justify-center mt-10 w-full">
          <Text
            className={`text-6xl font-bold ${
              colorScheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {formatTime(getSecondsUntilMidnight())}
          </Text>
        </View>
      </PageLayout>

      <FixedToBottom>
        {isTimerRunning && (
          <CustomButton
            title="Stop Timer"
            variant="danger"
            onPress={() => {
              setIsTimerRunning(false);
            }}
          />
        )}
        {!isTimerRunning && (
          <CustomButton
            title="Start Timer"
            onPress={() => {
              handleStartTimer();
            }}
          />
        )}
      </FixedToBottom>
    </>
  );
}
