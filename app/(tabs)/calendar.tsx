import MonthNavigator from "@/components/MonthNavigator";
import { BracesTime } from "@/types/BracesTime";
import { TimeData } from "@/types/TimeData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import CustomBottomSheet from "../../components/BottomSheet";
import CalendarDay from "../../components/CalendarDay";
import PageLayout from "../../components/PageLayout";
import formatTimeFromSeconds from "../../utils/formatTimeInSeconds";

export default function Calendar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const [timeData, setTimeData] = useState<TimeData[]>([]);
  const [bracesTime, setBracesTime] = useState<BracesTime[]>([]);
  const colorScheme = useColorScheme();

  const loadTimeData = async () => {
    try {
      const data = await AsyncStorage.getItem("timeData");
      if (data) {
        setTimeData(JSON.parse(data));
      }
    } catch (error) {
      console.log("Error loading time data:", error);
    }
  };

  const loadBracesTime = async () => {
    const bracesTime = await AsyncStorage.getItem("bracesTime");

    if (bracesTime) {
      setBracesTime(JSON.parse(bracesTime));
    }
  };


  const checkBraceWearDuration = async () => {
    console.log("New day");
    for (const brace of bracesTime) {
      if (brace.started && !brace.completed) {
        const startDate = new Date(brace.startDate);
        const currentDate = new Date();

        const daysBetween = Math.floor(
          (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        for (let i = 0; i <= daysBetween; i++) {
          const checkDate = new Date(startDate);
          checkDate.setDate(startDate.getDate() + i);

          if (dayHasMoreTime(checkDate.getDate())) {
            const dayData = timeData.find(
              (data) => data.date === checkDate.toDateString()
            );

            if (dayData) {
              const timeUsed = dayData.totalTimeUsed;
              const requiredTime = 22 * 60 * 60;
              const day = 24 * 60 * 60

              if (timeUsed === 0) {
                addTimeToEndDate(brace, day);
              } else {
                if (timeUsed > requiredTime) {

                  const extraTime = timeUsed - requiredTime;
                  addTimeToEndDate(brace, extraTime);
                }
              }
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    loadTimeData();
    loadBracesTime();
  }, []);

  useEffect(() => {
    const runOncePerDay = async () => {
      const today = new Date().toDateString();
      const lastRun = await AsyncStorage.getItem("lastCheckBraceWearDate");

      if (lastRun === today) return;

      await checkBraceWearDuration();
      await AsyncStorage.setItem("lastCheckBraceWearDate", today);
    };

    runOncePerDay();
  }, [timeData, bracesTime]);
  const addTimeToEndDate = (brace: BracesTime, time: number) => {
    const endDate = new Date(brace.endDate);
    endDate.setSeconds(endDate.getSeconds() + time);
    brace.endDate = endDate.toISOString();

    for (const brace of bracesTime) {
      if (!brace.started) {
        const startDate = new Date(brace.startDate);
        const endDate = new Date(brace.endDate);
        startDate.setSeconds(startDate.getSeconds() + time);
        endDate.setSeconds(endDate.getSeconds() + time);
        brace.startDate = startDate.toISOString();
        brace.endDate = endDate.toISOString();
      }
    }
    setBracesTime([...bracesTime]);
    AsyncStorage.setItem("bracesTime", JSON.stringify(bracesTime));
  };



  const dayHasMoreTime = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    if (!selectedDate) return false;

    if (!timeData || !Array.isArray(timeData) || timeData.length === 0) {
      return null;
    }

    const firstDate = new Date(timeData[0].date);
    const lastDate = new Date(timeData[timeData.length - 1].date);

    const selectedDateFormatted = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    if (selectedDateFormatted < firstDate || selectedDateFormatted > lastDate) {
      return null;
    }

    const today = new Date();

    if (selectedDateFormatted > today) {
      return null;
    }

    const dateKey = selectedDate.toDateString();
    let dayData: TimeData | null = null;

    for (const dayItem of timeData) {
      if (dayItem.date === dateKey) {
        dayData = dayItem;
        break;
      }
    }

    if (!dayData) return false;

    const timeLimit = 2 * 60 * 60; // 22 hours
    return dayData.totalTimeUsed > timeLimit || dayData.totalTimeUsed === 0;
  };

  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(month: number, year: number) {
    return new Date(year, month, 1).getDay();
  }

  async function handleDatePress(day: number) {
    setSheetOpen(true);
    setSelectedDay(day);

    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    let totalTimeUsed = 0;

    const dateKey = selectedDate.toDateString();
    let dayData: TimeData | null = null;

    for (const dayItem of timeData) {
      if (dayItem.date === dateKey) {
        dayData = dayItem;
        break;
      }
    }

    if (dayData) {
      totalTimeUsed = dayData.totalTimeUsed;
    }

    setTotalTimeUsed(totalTimeUsed);
  }

  function goToPreviousMonth() {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }

  function goToNextMonth() {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }

  function goToCurrentMonth() {
    setCurrentDate(new Date());
  }

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  };

  const renderDaysOfMonth = () => {
    const today = new Date();
    const isCurrentMonth =
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
    const currentDay = today.getDate();

    const daysInMonth = getDaysInMonth(
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
    const firstDayOfMonth = getFirstDayOfMonth(
      currentDate.getMonth(),
      currentDate.getFullYear()
    );

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} className="min-h-16 min-w-16" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = isCurrentMonth && i === currentDay;
      days.push(
        <CalendarDay
          key={i}
          onPress={() => {
            handleDatePress(i);
          }}
          active={isToday}
          hasMoreTime={dayHasMoreTime(i)}
        >
          {i}
        </CalendarDay>
      );
    }

    return days;
  };

  return (
    <>
      <PageLayout>
        <View className="flex-row items-center justify-between mb-4">
          <MonthNavigator onPress={goToPreviousMonth} next={false} />

          <TouchableOpacity onPress={goToCurrentMonth}>
            <Text
              className={`font-bold text-2xl ${
                colorScheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
            </Text>
          </TouchableOpacity>

          <MonthNavigator onPress={goToNextMonth} next={true} />
        </View>

        <View className="flex-row justify-between mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text
              key={day}
              className={`text-center min-w-16 text-sm font-medium ${
                colorScheme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {day}
            </Text>
          ))}
        </View>

        <View className="flex flex-row flex-wrap gap-2">
          {renderDaysOfMonth()}
        </View>
      </PageLayout>

      <CustomBottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text className="text-2xl color-blue-500 font-semibold">
          {getMonthName(currentDate.getMonth())} {selectedDay},{" "}
          {currentDate.getFullYear()}
        </Text>
        <Text className="mt-2 text-gray-600 text-xl">
          Total time used:{" "}
          <Text className="font-bold color-blue-500">
            {formatTimeFromSeconds(totalTimeUsed)}
          </Text>
        </Text>
      </CustomBottomSheet>
    </>
  );
}
