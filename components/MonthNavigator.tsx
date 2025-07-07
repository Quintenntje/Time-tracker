import { TouchableOpacity, useColorScheme } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface MonthNavigatorProps {
  onPress?: () => void;
  next?: boolean;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ onPress, next }) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-2 rounded-full ${
        next ? "bg-gray-100 dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-800"
      }`}
    >
      <Icon
        name={next ? "chevron-forward-outline" : "chevron-back-outline"}
        size={24}
        color={colorScheme === "dark" ? "white" : "black"}
      />
    </TouchableOpacity>
  );
};

export default MonthNavigator;
