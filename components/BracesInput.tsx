import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface BracesInputProps {
  value: number;
  onChange: (value: number) => void;
}

const BracesInput: React.FC<BracesInputProps> = ({ value, onChange }) => {
  const colorScheme = useColorScheme();
  const [inputValue, setInputValue] = useState(value.toString());

  const handleIncrement = () => {
    const newValue = parseInt(inputValue) + 1;
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(0, parseInt(inputValue) - 1);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const numValue = parseInt(text) || 0;
    onChange(numValue);
  };

  return (
    <View className="items-center space-y-3">
      <View className="flex-row items-center justify-center space-x-4">
        <TouchableOpacity
          onPress={handleDecrement}
          className={`w-12 h-12 rounded-full border-2 items-center justify-center ${
            colorScheme === "dark"
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-gray-100"
          }`}
        >
          <Text
            className={`text-2xl font-bold ${
              colorScheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            -
          </Text>
        </TouchableOpacity>

        <View
          className={`w-24 h-16 rounded-lg border-2 mx-4 flex items-center justify-center  ${
            colorScheme === "dark"
              ? "border-blue-500 bg-gray-800"
              : "border-blue-500 bg-white"
          }`}
        >
          <TextInput
            value={inputValue}
            onChangeText={handleInputChange}
            keyboardType="numeric"
            textAlign="center"
            className={`text-2xl font-bold w-full h-full ${
              colorScheme === "dark" ? "text-white" : "text-gray-900"
            }`}
            placeholder="0"
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
          />
        </View>

        <TouchableOpacity
          onPress={handleIncrement}
          className={`w-12 h-12 rounded-full border-2 items-center justify-center ${
            colorScheme === "dark"
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-gray-100"
          }`}
        >
          <Text
            className={`text-2xl font-bold ${
              colorScheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        className={`text-lg font-medium ${
          colorScheme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        braces
      </Text>
    </View>
  );
};

export default BracesInput;
