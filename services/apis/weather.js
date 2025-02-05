const weatherApiKey = process.env.EXPO_PUBLIC_WETHER_API_KEY;

const toMinutes = (time) => {
  const [hours, minutesPart] = time.split(":");
  const minutes = parseInt(minutesPart, 10);
  const isPM = time.includes("PM");
  let totalHours = parseInt(hours, 10);

  if (isPM && totalHours !== 12) totalHours += 12;
  if (!isPM && totalHours === 12) totalHours = 0;

  return totalHours * 60 + minutes;
};

const calculateDaylight = (sunrise, sunset) => {
  const sunriseMinutes = toMinutes(sunrise);
  const sunsetMinutes = toMinutes(sunset);
  const totalDaylightMinutes = sunsetMinutes - sunriseMinutes;

  const hours = Math.floor(totalDaylightMinutes / 60);
  const minutes = totalDaylightMinutes % 60;

  return {
    hours,
    minutes: minutes < 10 ? `0${minutes}` : minutes,
  };
};

const formatSunsetTime = (sunset) => {
  const sunsetHours = +sunset.split(":")[0] + 12;
  return `${sunsetHours}:${sunset.split(":")[1]}`.split(" ")[0];
};

export const fetchWeatherData = async (latitude, longitude) => {
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
};

export const formatWeatherData = (weatherData) => {
  if (
    !weatherData.forecast ||
    !weatherData.forecast.forecastday ||
    !weatherData.forecast.forecastday[0]
  ) {
    throw new Error("Invalid forecast data");
  }

  const { sunrise, sunset } = weatherData.forecast.forecastday[0].astro;
  const forecastHours = weatherData.forecast.forecastday[0].hour;

  if (!forecastHours) {
    throw new Error("Invalid forecast data");
  }

  const daylight = calculateDaylight(sunrise, sunset);
  const sunsetFormatted = formatSunsetTime(sunset);

  return {
    cloudiness: forecastHours[0].cloud,
    sunDayHours: `${daylight.hours}.${daylight.minutes}`,
    hourlyClouds: forecastHours.map((hour) => hour.cloud),
    sunrise: sunrise.split(" ")[0],
    sunset: sunsetFormatted,
  };
};
