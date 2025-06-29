import { Text, useColorScheme, View } from "react-native";
import CalendarDay from "../../components/CalendarDay";
import PageLayout from "../../components/PageLayout";

export default function Index() {
  const colorScheme = useColorScheme();


  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  const renderDaysOfMonth = () => {
    const date = new Date();
    const today = date.getDate();

    const days = [];
    for (let i = 1; i <= getDaysInMonth(date.getMonth(), date.getFullYear()); i++) {
      days.push(
        <CalendarDay key={i} onPress={() => {}} active={i === today}>
          {i}
        </CalendarDay>
      );
    }
    return days;
  };

  return (
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
  );
}
