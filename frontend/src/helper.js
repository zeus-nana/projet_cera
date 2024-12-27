export function formatNumber(num) {
  // eslint-disable-next-line no-undef
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" });
}

export const formatLargeNumber = (number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(0) + "k";
  }
  return number.toString();
};
