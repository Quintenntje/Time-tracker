import { Link } from "expo-router";
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
        Welcome
      </Text>
      <Link
        href="/onboarding"
        className={`mt-4 ${
          colorScheme === "dark" ? "text-blue-400" : "text-blue-600"
        }`}
      >
        Onboarding
      </Link>
    </PageLayout>
  );
}
