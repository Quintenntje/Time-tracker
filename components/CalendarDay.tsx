import { Pressable, Text, View, useColorScheme } from "react-native";

interface PageLayoutProps {
  children: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
}

const CalendarDay: React.FC<PageLayoutProps> = ({
  children,
  onPress,
  active,
}) => {
  const colorScheme = useColorScheme();
  return (
    <Pressable onPress={onPress}>
      <View
        className={`flex justify-center items-center p-4 min-h-16 min-w-16 rounded-full border border-gray-300 dark:border-gray-700 ${
          active ? "bg-blue-500 dark:bg-blue-700" : ""
        }`}
      >
        <Text
          className={`${
            colorScheme === "dark" ? "text-gray-50" : "text-gray-900"
          } ${active ? "text-white" : ""}`}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  );
};

export default CalendarDay;
