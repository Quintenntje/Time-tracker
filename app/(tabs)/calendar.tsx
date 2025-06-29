import { Text, useColorScheme, View } from "react-native";
import CalendarDay from "../../components/CalendarDay";
import PageLayout from "../../components/PageLayout";

export default function Index() {
  const colorScheme = useColorScheme();

  const daysOfMonth = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(
        <CalendarDay key={i} onPress={() => {}} active={false}>
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
        {daysOfMonth()}
      </View>
    </PageLayout>
  );
}
