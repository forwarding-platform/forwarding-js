import dayjs, { extend, duration as _duration } from "dayjs";
import duration from "dayjs/plugin/duration";
extend(duration);

export function getTimeElapsed(createdDate) {
  const now = dayjs();
  const duration = _duration(now.diff(createdDate));

  if (duration.asMinutes() < 60) {
    if (Math.floor(duration.asMinutes()) < 0) return "a few seconds ago";
    return `${Math.floor(duration.asMinutes())} minute${
      Math.floor(duration.asMinutes()) === 1 ? "" : "s"
    } ago`;
  } else if (duration.asHours() < 24) {
    return `${Math.floor(duration.asHours())} hour${
      Math.floor(duration.asHours()) === 1 ? "" : "s"
    } ago`;
  } else if (duration.asDays() < 7) {
    return `${Math.floor(duration.asDays())} day${
      Math.floor(duration.asDays()) === 1 ? "" : "s"
    } ago`;
  } else {
    return createdDate.format("YYYY-MM-DD");
  }
}

// Example usage:
const createdDate = dayjs("2023-03-22T12:34:56+01:00"); // Replace with your created date
const timeElapsed = getTimeElapsed(createdDate);
console.log(timeElapsed); // Output: 3 hours ago (assuming current time is 2023-03-22T15:34:56+01:00)
