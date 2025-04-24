export default function setLabel(index, data, interval) {
  if (index === 0) {
    return interval;
  } else if (index === data.length - 1) {
    return interval.split("-")[1];
  } else {
    if (index % 3 === 0 && index !== data.length - 2) {
      return interval.split("-")[1];
    } else {
      return "";
    }
  }
}
