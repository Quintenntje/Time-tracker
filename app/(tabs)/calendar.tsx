import { Text, useColorScheme } from "react-native";
import PageLayout from "../../components/PageLayout";

export default function Index() {
  const colorScheme = useColorScheme();

  return (
    <PageLayout>
      <Text
        className={`font-bold text-5xl ${
          colorScheme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Calendar
      </Text>
    </PageLayout>
  );
}
