import { useRef, useMemo, type FC } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { useSignal, useSignalEffect, useComputed } from "@preact/signals-react";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import useToastStore from "./store";
import type { Toast } from "./types";
import { makeVariants } from "./make-variants";

interface ToastNotificationProps extends Toast {
  role?: string;
}

export const ToastNotification = ({
  id,
  content,
  variant = "info",
  duration = 5000,
  position,
  role = "alert",
  halted = false,
  pauseOnHover = true,
}: ToastNotificationProps) => {
  useSignals();
  const paused = useSignal(halted);
  const remainingTime = useSignal(halted ? 0 : duration);
  const removeNotification = useToastStore((state) => state.removeNotification);
  const frameRef = useRef<number | null>(null);
  const timestampRef = useRef<number | null>(null);

  const positionAttrs = useMemo(() => {
    const [vertical, horizontal] = position.split("-");
    return {
      "data-position": vertical,
      "data-placement": horizontal,
    };
  }, [position]);

  const MessageComponent = useMemo(
    () =>
      typeof content === "string"
        ? () => <p>{content as string}</p>
        : (content as FC),
    [content],
  );

  const variants = useMemo(() => makeVariants(position), [position]);

  const progressBarStyle = useComputed<{
    width: string;
  }>(() => ({
    width: `${(remainingTime.value / duration) * 100}%`,
  }));

  const handleClose = () => removeNotification(id);

  const handleProgress = (timestamp: number) => {
    if (!timestampRef.current) {
      timestampRef.current = timestamp;
    }

    const diff = timestamp - (timestampRef.current ?? 0);

    if (diff >= 50) {
      remainingTime.value -= 50;
      timestampRef.current = timestamp;
    }

    frameRef.current = requestAnimationFrame(handleProgress);

    // Additional check for unexpected state:
    if (remainingTime.value < 0) {
      console.warn("Remaining time is negative. Stopping animation.");
      cancelAnimationFrame(frameRef.current);
    }
  };

  useSignalEffect(() => {
    if (!paused.value) {
      frameRef.current = requestAnimationFrame(handleProgress);
    }

    if (!pauseOnHover) return;

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timestampRef.current) cancelAnimationFrame(timestampRef.current);
    };
  });

  useSignalEffect(() => {
    if (duration && remainingTime.value <= 0 && !halted) {
      removeNotification(id);
    }
  });

  return (
    <motion.div
      key={id}
      className={`bg-white rounded shadow-md border-l-4 max-w-xs text-black relative grid grid-flow-col-dense toast-${variant}`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      role={role}
      aria-live="assertive"
      aria-atomic="true"
      onMouseEnter={() => !halted && (paused.value = true)}
      onMouseLeave={() => !halted && (paused.value = false)}
      {...positionAttrs}
    >
      <div className="p-4" id={`toast-message-${id}`}>
        <MessageComponent />
      </div>
      <Button
        isIconOnly
        onClick={handleClose}
        aria-label="Close toast notification"
        variant="light"
        size="md"
        radius="full"
      >
        &times;
      </Button>
      <div
        className="toast-progress-bar"
        role="progressbar"
        aria-valuenow={(remainingTime.value / duration) * 100}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby={`toast-message-${id}`}
      >
        <div
          className="toast-progress-bar-indicator"
          style={progressBarStyle.value}
        />
      </div>
    </motion.div>
  );
};
