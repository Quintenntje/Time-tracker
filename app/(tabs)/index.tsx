import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import CustomButton from "../../components/Button";
import FixedToBottom from "../../components/FixedToBottom";
import PageLayout from "../../components/PageLayout";

interface TimeData {
  date: string;
  totalTimeUsed: number;
  sessions: {
    startTime: string;
    endTime: string;
    duration: number;
  }[];
}

export default function Index() {
  const colorScheme = useColorScheme();
  const [time, setTime] = useState(86400);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());

  const loadStoredData = async () => {
    try {
      const storedTime = await AsyncStorage.getItem("time");
      const storedIsRunning = await AsyncStorage.getItem("isTimerRunning");
      const storedDate = await AsyncStorage.getItem("lastResetDate");

      if (storedTime) {
        const parsedTime = parseInt(storedTime);
        if (!isNaN(parsedTime)) {
          setTime(parsedTime);
        } else {
          setTime(86400);
        }
      }
      if (storedIsRunning) setIsTimerRunning(JSON.parse(storedIsRunning));
      if (storedDate) setLastResetDate(storedDate);
    } catch (error) {
      console.log("Error loading stored data:", error);
    }
  };

  const saveTime = async (newTime: number) => {
    try {
      await AsyncStorage.setItem("time", newTime.toString());
    } catch (error) {
      console.log("Error saving time:", error);
    }
  };

  const saveTimerState = async (isRunning: boolean) => {
    try {
      await AsyncStorage.setItem("isTimerRunning", JSON.stringify(isRunning));
    } catch (error) {
      console.log("Error saving timer state:", error);
    }
  };

  const saveTimeData = async (timeData: TimeData) => {
    try {
      const existing = await AsyncStorage.getItem("timeData");
      let updatedData = timeData;

      if (existing !== null) {
        const parsed = JSON.parse(existing);
        updatedData = { ...parsed, ...timeData };
      }

      await AsyncStorage.setItem("timeData", JSON.stringify(updatedData));
    } catch (error) {
      console.log("Error saving time data:", error);
    }
  };

  const checkNewDay = async () => {
    const today = new Date().toDateString();
    const savedDate = await AsyncStorage.getItem("lastResetDate");

    if (savedDate !== today) {
      setTime(86400);
      setIsTimerRunning(false);
      setLastResetDate(today);
      await storeTimeData();

      await AsyncStorage.setItem("lastResetDate", today);
      await saveTime(86400);
      await saveTimerState(false);
    }
  };

  const storeTimeData = async () => {
    const timeData: TimeData = {
      date: new Date().toDateString(),
      totalTimeUsed: 86400 - time,
      sessions: [
        {
          startTime: new Date().toISOString(),
          endTime: new Date(
            new Date().getTime() + (86400 - time) * 1000
          ).toISOString(),
          duration: 86400 - time,
        },
      ],
    };
    await saveTimeData(timeData);
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
    saveTimerState(true);
  }

  function handleStopTimer() {
    setIsTimerRunning(false);
    saveTimerState(false);
  }

  useEffect(() => {
    loadStoredData();
  }, []);

  useEffect(() => {
    checkNewDay();
    const dayCheckInterval = setInterval(checkNewDay, 60000);
    return () => clearInterval(dayCheckInterval);
  }, [lastResetDate]);

  useEffect(() => {
    let timer: number;
    if (isTimerRunning) {
      timer = setInterval(async () => {
        setTime((prevTime) => {
          const newTime = prevTime <= 0 ? 0 : prevTime - 1;

          saveTime(newTime);

          if (newTime <= 0) {
            setIsTimerRunning(false);
            saveTimerState(false);
          }

          return newTime;
        });
        await storeTimeData();
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
            onPress={handleStopTimer}
          />
        )}
        {!isTimerRunning && (
          <CustomButton title="Start Timer" onPress={handleStartTimer} />
        )}
      </FixedToBottom>
    </>
  );
}
