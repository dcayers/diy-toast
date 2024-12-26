import { useRef, useMemo, type FC } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { useSignal, useSignalEffect, useComputed } from "@preact/signals-react";
import { Button, cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import useToastStore from "./store";
import type { Toast } from "./types";
import { makeVariants } from "./make-variants";

interface ToastNotificationProps extends Toast {
  role?: string;
}

// TODO: Adjust default duration for WCAG 2.2.1 -- allow flexibility for users
// https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html

const variantStyles = {
  success: "shadow-green-500/25 border-l-green-500",
  error: "shadow-red-500/25 border-l-red-500",
  warning: "shadow-yellow-500/25 border-l-yellow-500",
  info: "shadow-blue-500/25 border-l-blue-500",
};

export const ToastNotification = ({
  id,
  title,
  content,
  variant = "info",
  duration = 5000,
  position,
  role = "alert",
  halted = false,
  pauseOnHover = true,
  ariaLabelledby,
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
        ? () => (
            <div className="grid gap-4">
              {title ? <h2 className="text-2xl font-bold">{title}</h2> : null}
              <p className="text-black">{content}</p>
            </div>
          )
        : (content as FC),
    [title, content]
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
      className={cn(
        "bg-white rounded shadow-md border-l-4 max-w-xs text-black relative grid grid-flow-col-dense auto-cols-[1fr_auto]",
        variantStyles[variant]
      )}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      role={role}
      aria-live="assertive"
      aria-atomic="true"
      aria-labelledby={ariaLabelledby ?? `toast-message-${id}`}
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
        aria-label="Close notification"
        variant="light"
        size="md"
        radius="full"
      >
        &times;
      </Button>
      <div
        className="min-h-1 bg-blue-500/50 absolute bottom-0 left-0 rounded-t w-full"
        role="progressbar"
        aria-valuenow={(remainingTime.value / duration) * 100}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby={`toast-message-${id}`}
      >
        <div
          className="min-h-1 bg-blue-500 rounded-t transition-all duration-[50]"
          style={progressBarStyle.value}
        />
      </div>
    </motion.div>
  );
};
