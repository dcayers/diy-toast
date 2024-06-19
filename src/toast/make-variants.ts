export const makeVariants = (position: string) => ({
  initial: { opacity: 0, y: position.includes("top") ? -50 : 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
  exit: { opacity: 0, scale: 0.8, y: position.includes("top") ? 50 : -50 },
});
