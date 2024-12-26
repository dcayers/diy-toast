import { cn } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastNotification } from "./notification";
import { useGroupedNotifications } from "./use-grouped-notifications";
import { makeVariants } from "./make-variants";

const styles = {
  positionTop: "[&_[data-position=top]]:top-[var(--toast-top)]",
  positionBottom: "[&_[data-position=bottom]]:bottom-[var(--toast-bottom)]",
  positionCenter:
    "[&>[data-position=center]]:top-1/2 [&>[data-position=center]]:-translate-y-1/2",
  placementLeft: "[&_[data-placement=left]]:left-[var(--toast-left)]",
  placementRight: "[&_[data-placement=right]]:right-[var(--toast-right)]",
  placementCenter:
    "[&>[data-placement=center]]:left-1/2 [&>[data-placement=center]]:-translate-x-1/2",
  transform:
    "[&>[data-position=center]]:!transform [&>[data-placement=center]]:!transform",
};

const formatAriaLabel = (count: number) =>
  `${count} notification${count === 1 ? "" : "s"} available`;

export const ToastContainer = () => {
  const groups = useGroupedNotifications();
  return (
    <div
      className={cn(
        styles.positionTop,
        styles.positionBottom,
        styles.positionCenter,
        styles.placementLeft,
        styles.placementRight,
        styles.placementCenter,
        styles.transform
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
              aria-label={formatAriaLabel(notifications.length)}
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
