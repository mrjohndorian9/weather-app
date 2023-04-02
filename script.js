async function getWeather(place) {
  const url = `https://api.weatherapi.com/v1/current.json?key=915ce40b87ca4f7381a183907232903&q=${place}&aqi=no`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}

getWeather('Omsk');
