import { useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import CustomBottomSheet from "../../components/BottomSheet";
import CalendarDay from "../../components/CalendarDay";
import PageLayout from "../../components/PageLayout";

export default function Calendar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const colorScheme = useColorScheme();

  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function handleDatePress(day: number) {
    setSheetOpen(true);
    setSelectedDay(day);
  }

  const renderDaysOfMonth = () => {
    const date = new Date();
    const today = date.getDate();

    const days = [];
    for (
      let i = 1;
      i <= getDaysInMonth(date.getMonth(), date.getFullYear());
      i++
    ) {
      days.push(
        <CalendarDay
          key={i}
          onPress={() => {
            handleDatePress(i);
          }}
          active={i === today}
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
        <Text
          className={`font-bold text-5xl ${
            colorScheme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Calendar
        </Text>
        <View className="flex flex-row flex-wrap flex-grow gap-2 mt-4">
          {renderDaysOfMonth()}
        </View>
      </PageLayout>
      <CustomBottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text className="text-lg font-semibold">The day is {selectedDay}</Text>
        <Text className="mt-2 text-gray-600">{selectedDay}</Text>
      </CustomBottomSheet>
      );
    </>
  );
}
