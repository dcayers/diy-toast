import { cn } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastNotification } from "./notification";
import { useGroupedNotifications } from "./use-grouped-notifications";
import { makeVariants } from "./make-variants";

export const ToastContainer = () => {
  const groups = useGroupedNotifications();
  return (
    <div
      className={cn(
        "[&_[data-position=top]]:top-[var(--toast-top)]",
        "[&_[data-position=bottom]]:bottom-[var(--toast-bottom)]",
        "[&_[data-placement=left]]:left-[var(--toast-left)]",
        "[&_[data-placement=right]]:right-[var(--toast-right)]",
      )}
    >
      <AnimatePresence>
        {Object.entries(groups.value).map(([position, notifications]) => {
          const [vertical, horizontal] = position.split("-");
          const positionAttrs = {
            "data-position": vertical,
            "data-placement": horizontal,
          };
          return (
            <motion.div
              key={position}
              className={`fixed z-50 flex flex-col gap-4`}
              variants={makeVariants(position)}
              initial="initial"
              animate="animate"
              exit="exit"
              role="region"
              {...positionAttrs}
            >
              <AnimatePresence>
                {notifications.toReversed().map((notification) => (
                  <ToastNotification
                    key={"toast" + notification.id}
                    {...notification}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
