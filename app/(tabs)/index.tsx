import { useEffect, useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import CustomButton from "../../components/Button";
import FixedToBottom from "../../components/FixedToBottom";
import PageLayout from "../../components/PageLayout";

export default function Index() {
  const colorScheme = useColorScheme();
  const [time, setTime] = useState(86400);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());

  const checkNewDay = () => {
    const today = new Date().toDateString();
    if (today !== lastResetDate) {
      setTime(86400);
      setIsTimerRunning(false);
      setLastResetDate(today);
    }
  };

  const timeLeft = (time: number) => {
    const limit = 22 * 60 * 60;
    const timeLeft = time - limit;

    return formatTime(timeLeft);
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
  }

  useEffect(() => {
    checkNewDay();
    const dayCheckInterval = setInterval(checkNewDay, 60000);
    return () => clearInterval(dayCheckInterval);
  }, [lastResetDate]);

  useEffect(() => {
    let timer: number;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer!);
            setIsTimerRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTimerRunning]);

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
            {formatTime(time)}
          </Text>
        </View>

        <View className="flex items-center justify-center mt-5">
          <Text
            className={`text-lg font-bold ${
              colorScheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Time Left:
          </Text>
          <Text
            className={`text-4xl font-bold ${
              colorScheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {timeLeft(time)}
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
