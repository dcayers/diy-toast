import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { Actions, State } from "./types";

const useToastStore = create(
  subscribeWithSelector<State & Actions>((set) => ({
    notifications: [],
    addNotification: (notification) =>
      set(
        produce<State>((state) => {
          state.notifications.push({ id: uuidv4(), ...notification });
        })
      ),
    removeNotification: (id) =>
      set(
        produce<State>((state) => {
          state.notifications = state.notifications.filter(
            (notification) => notification.id !== id
          );
        })
      ),
  }))
);

export default useToastStore;
