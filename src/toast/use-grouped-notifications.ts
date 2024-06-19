import { signal } from "@preact/signals-react";
import useToastStore from "./store";
import { Toast } from "./types";

export const useGroupedNotifications = () => {
  const notifications = useToastStore((state) => state.notifications);
  const groupedNotifications = signal<{ [key: string]: Toast[] }>({});

  // Function to update groupedNotifications
  const updateGroupedNotifications = () => {
    groupedNotifications.value = Object.groupBy(
      notifications,
      ({ position }) => (position ? position : "top-right"),
    );
  };

  // Initial grouping
  updateGroupedNotifications();

  // Subscribe to changes in the notifications array
  useToastStore.subscribe(
    (state) => state.notifications,
    updateGroupedNotifications,
    { equalityFn: (a, b) => a === b }, // To prevent unnecessary updates
  );

  return groupedNotifications;
};
