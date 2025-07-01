export const getInitials = (name: string): string => {
  const words = name.split(" ");
  const initials = words
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return initials.toUpperCase();
};
