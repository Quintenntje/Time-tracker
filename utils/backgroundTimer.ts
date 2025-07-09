import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundTask from "expo-background-task";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

const TIMER_TASK = "background-timer-task";

TaskManager.defineTask(TIMER_TASK, async () => {
  try {
    const isTimerRunning = await AsyncStorage.getItem("isTimerRunning");
    console.log("isTimerRunning", isTimerRunning);
    if (isTimerRunning === "true") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Invisalign Timer",
          body: "Your timer is still running!",
        },
        trigger: null,
      });
    }
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerBackgroundTask() {
  try {
    await BackgroundTask.registerTaskAsync(TIMER_TASK, {
      minimumInterval: 15 * 60,
    });
  } catch (error) {
    console.log("Failed to register background task:", error);
  }
}
