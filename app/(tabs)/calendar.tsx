import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CustomBottomSheet from "../../components/BottomSheet";
import CalendarDay from "../../components/CalendarDay";
import PageLayout from "../../components/PageLayout";

export default function Calendar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const [timeData, setTimeData] = useState<Record<string, any>>({});
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

  useEffect(() => {
    loadTimeData();
  }, []);

  const dayHasTooMuchTime = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dateKey = selectedDate.toDateString();
    const dayData = timeData[dateKey];

    if (!dayData) return false;

    const timeLimit = 2 * 60 * 60;
    return dayData.totalTimeUsed > timeLimit;
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
    const data = await AsyncStorage.getItem("timeData");

    if (data) {
      const selectedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const parsedData = JSON.parse(data);
      const dateKey = selectedDate.toDateString();
      const existingData = parsedData[dateKey] || [];

      const totalTimeUsed = existingData.totalTimeUsed || 0;

      setTotalTimeUsed(totalTimeUsed);
    } else {
      console.log("No data found for the selected date.");
    }
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
          toMuchTimeUsed={dayHasTooMuchTime(i)}
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
          <TouchableOpacity
            onPress={goToPreviousMonth}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <Icon
              name="chevron-back-outline"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToCurrentMonth}>
            <Text
              className={`font-bold text-2xl ${
                colorScheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextMonth}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <Icon
              name="chevron-forward-outline"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
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
          <Text className="font-bold color-blue-500">{totalTimeUsed} min</Text>
        </Text>
      </CustomBottomSheet>
    </>
  );
}
