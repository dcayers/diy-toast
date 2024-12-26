import type { FC } from "react";

/**
 * The variant of the toast notification.
 * @default "info"
 * @variant "success" - The toast notification is successful.
 * @variant "error" - The toast notification is an error.
 * @variant "warning" - The toast notification is a warning.
 * @variant "info" - The toast notification is informational.
 * @example
 * variant: "success"
 */
export type Variant = "success" | "error" | "warning" | "info";

type VerticalPosition = "top" | "bottom" | "center";
type HorizontalPosition = "left" | "right" | "center";

export type Position = `${VerticalPosition}-${HorizontalPosition}`;

export interface Toast {
  id: string;
  position: Position;
  content: string | FC;
  title?: string;
  variant?: Variant;
  duration?: number;
  halted?: boolean;
  pauseOnHover?: boolean;
  ariaLabelledby?: string;
}

export interface State {
  notifications: Toast[];
}

export interface Actions {
  addNotification: (notification: Omit<Toast, "id">) => void;
  removeNotification: (id: Toast["id"]) => void;
}
