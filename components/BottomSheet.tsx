import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const CustomBottomSheet: React.FC<BottomSheetProps> = ({
  children,
  isOpen,
  onClose,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const colorScheme = useColorScheme();

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  if (!isOpen) return null;

  return (
    <GestureHandlerRootView
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "transparent",
        zIndex: 1000,
      }}
    >
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
        }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === "dark" ? "#6B7280" : "#D1D5DB",
        }}
      >
        <BottomSheetView className="flex-1 p-4">{children}</BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default CustomBottomSheet;
