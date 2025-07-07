import { Pressable, Text, View, useColorScheme } from "react-native";

interface PageLayoutProps {
  children: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
  hasLessTime?: boolean | null;
}

const CalendarDay: React.FC<PageLayoutProps> = ({
  children,
  onPress,
  active,
  hasLessTime = false,
}) => {
  const colorScheme = useColorScheme();

  const getBorderColor = () => {
    if (hasLessTime === null) {
      return "border-gray-300 dark:border-gray-700";
    }
    if (hasLessTime === false) {
      return "border-red-500 dark:border-red-700";
    }
    return "border-green-500 dark:border-green-700";
  };

  return (
    <Pressable onPress={onPress}>
      <View
        className={`flex justify-center items-center p-4 min-h-16 min-w-16 rounded-full border  ${getBorderColor()} ${
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
