import type { FC } from "react";

export type Variant = "success" | "error" | "warning" | "info";
export type Position =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface Toast {
  id: string;
  content: string | FC;
  variant?: Variant;
  duration?: number;
  position: Position;
  halted?: boolean;
  pauseOnHover?: boolean;
}

export interface State {
  notifications: Toast[];
}

export interface Actions {
  addNotification: (notification: Omit<Toast, "id">) => void;
  removeNotification: (id: Toast["id"]) => void;
}
