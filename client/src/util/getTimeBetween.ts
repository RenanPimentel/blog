type Time = "year" | "month" | "day" | "week" | "hour" | "minute" | "second";

const getFormattedTime = (num: number, type: Time) => {
  if (num === 1) {
    return `a ${type} ago`;
  }

  if (type !== "second") {
    return `${num} ${type}s ago`;
  } else {
    return "now";
  }
};

export const getTimeBetween = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);

  const timeBetween = Number(now) - Number(date);

  const secs = Math.floor(timeBetween / 1000);
  const mins = Math.floor(timeBetween / (1000 * 60));
  const hours = Math.floor(timeBetween / (1000 * 60 * 60));
  const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(timeBetween / (1000 * 60 * 60 * 24 * 7));
  const months = Math.floor(timeBetween / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(timeBetween / (1000 * 60 * 60 * 24 * 30 * 365));

  return years
    ? getFormattedTime(years, "year")
    : months
    ? getFormattedTime(months, "month")
    : weeks
    ? getFormattedTime(weeks, "week")
    : days
    ? getFormattedTime(days, "day")
    : hours
    ? getFormattedTime(hours, "hour")
    : mins
    ? getFormattedTime(mins, "minute")
    : getFormattedTime(secs, "second");
};
