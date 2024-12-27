export default function setLabel(index, data, interval) {
  if (index === 0 || index === data.length - 1) {
    return interval;
  } else {
    if (index % 2 === 0) {
      return interval.split("-")[1];
    } else {
      return "";
    }
  }
}
