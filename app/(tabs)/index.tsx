import { BracesTime } from "@/types/BracesTime";
import { TimeData } from "@/types/TimeData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppState, Text, useColorScheme, View } from "react-native";
import CustomButton from "../../components/Button";
import FixedToBottom from "../../components/FixedToBottom";
import PageLayout from "../../components/PageLayout";

export default function Index() {
  const colorScheme = useColorScheme();
  const [time, setTime] = useState(86400);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lastStartTime, setLastStartTime] = useState<number | null>(null);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());
  const [bracesTime, setBracesTime] = useState<BracesTime[]>([]);

  const loadStoredData = async () => {
    try {
      const storedTime = await AsyncStorage.getItem("time");
      const storedIsRunning = await AsyncStorage.getItem("isTimerRunning");
      const storedDate = await AsyncStorage.getItem("lastResetDate");
      const storedBracesTime = await AsyncStorage.getItem("bracesTime");
      const storedLastStartTime = await AsyncStorage.getItem("lastStartTime");

      if (storedBracesTime) {
        setBracesTime(JSON.parse(storedBracesTime));
      }

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
      if (storedLastStartTime) setLastStartTime(parseInt(storedLastStartTime));
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

  const schedulePushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Invisalign is still running",
        body: `Time remaining: ${formatTime(time)}`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 0,
        minute: 15,
      },
    });
  };

  useEffect(() => {
    if (isTimerRunning) {
      storeTimeData();
    }
  }, [isTimerRunning, time]);

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
      let updatedData: TimeData[] = [];

      if (existing !== null) {
        const parsed: TimeData[] = JSON.parse(existing);

        const existingIndex = parsed.findIndex(
          (item) => item.date === timeData.date
        );

        if (existingIndex !== -1) {
          updatedData = [...parsed];
          updatedData[existingIndex] = timeData;
        } else {
          updatedData = [...parsed, timeData];
        }
      } else {
        updatedData = [timeData];
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

  async function handleStartTimer() {
    setIsTimerRunning(true);
    saveTimerState(true);

    const currentTime = new Date().getTime();
    setLastStartTime(currentTime);
    await AsyncStorage.setItem("lastStartTime", currentTime.toString());
    await AsyncStorage.setItem("initialTime", time.toString());

    await schedulePushNotification();
  }

  async function handleStopTimer() {
    setIsTimerRunning(false);
    saveTimerState(false);

    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  const CheckTimePassedInBackground = async () => {
    try {
      const lastStartTimeStr = await AsyncStorage.getItem("lastStartTime");
      const isTimerRunningStr = await AsyncStorage.getItem("isTimerRunning");
      const initialTimeStr = await AsyncStorage.getItem("initialTime");

      if (isTimerRunningStr === "true" && lastStartTimeStr && initialTimeStr) {
        const lastStartTime = parseInt(lastStartTimeStr);
        const initialTime = parseInt(initialTimeStr);
        const timeNow = new Date().getTime();
        const timePassed = Math.floor((timeNow - lastStartTime) / 1000);
        const newTime = Math.max(initialTime - timePassed, 0);

        setTime(newTime);
        saveTime(newTime);

        if (newTime <= 0) {
          setIsTimerRunning(false);
          saveTimerState(false);
        }
      }
    } catch (error) {
      console.log("Error checking time passed in background:", error);
    }
  };

  const checkIfBraceIsStarted = () => {
    for (const brace of bracesTime) {
      if (brace.started === true) {
        return true;
      }
    }
    return false;
  };

  const useAppFocus = (onAppOpen: () => void) => {
    useEffect(() => {
      const subscription = AppState.addEventListener("change", (state) => {
        if (state === "active") {
          onAppOpen();
        }
      });

      return () => subscription.remove();
    }, []);
  };

  useAppFocus(CheckTimePassedInBackground);

  useFocusEffect(
    React.useCallback(() => {
      loadStoredData();
    }, [])
  );

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

        {bracesTime.length === 0 ? (
          <View className="flex items-center justify-center mt-10 w-full">
            <Text
              className={`text-xl text-center ${
                colorScheme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No braces found, add the total braces to get started
            </Text>
          </View>
        ) : !checkIfBraceIsStarted() ? (
          <View className="flex items-center justify-center mt-10 w-full">
            <Text
              className={`text-xl text-center ${
                colorScheme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No active braces found. Start a brace to begin tracking time.
            </Text>
          </View>
        ) : (
          <>
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
          </>
        )}
      </PageLayout>

      <FixedToBottom>
        {bracesTime.length === 0 ? (
          <CustomButton
            size="large"
            title="Set Braces Time"
            onPress={() => router.push("/braces")}
          />
        ) : !checkIfBraceIsStarted() ? (
          <CustomButton
            size="large"
            title="Go to Braces"
            onPress={() => router.push("/braces")}
          />
        ) : (
          <>
            {isTimerRunning && (
              <CustomButton
                title="Stop Timer"
                size="large"
                variant="danger"
                onPress={handleStopTimer}
              />
            )}
            {!isTimerRunning && (
              <CustomButton
                title="Start Timer"
                size="large"
                onPress={handleStartTimer}
              />
            )}
          </>
        )}
      </FixedToBottom>
    </>
  );
}
