const input = document.querySelector('input');
const form = document.querySelector('form');
const city = document.querySelector('#city');
const temp = document.querySelector('#temp');
const content = document.querySelector('#content');
const conditionNode = document.querySelector('#condition');
const imgNode = document.querySelector('img');
const feelslike = document.querySelector('#feelslike__value');
const wind = document.querySelector('#wind__value');
const time = document.querySelector('#time__value');
let tempScale = 'C';

async function getData(place) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=915ce40b87ca4f7381a183907232903&q=${place}&aqi=no&days=7`;
  const response = await fetch(url, {
    mode: 'cors'
  });
  const data = await response.json();
  return data;
}

function getForecastHtml(forecastData) {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  function getOneDay(dayData) {
    const dayIndex = new Date(dayData.date).getDay();
    const day = days[dayIndex];

    const div = document.createElement('div');
    div.className =
      'flex gap-2 justify-between items-center font-bold [&>*]:w-full [&>*]:text-center border-y border-gray';
    const dayNode = document.createElement('p');
    dayNode.textContent = day;
    const temp = dayData.day.avgtemp_c;
    const tempNode = document.createElement('p');
    tempNode.textContent = temp;
    const imgUrl = new URL(`http://${dayData.day.condition.icon}`);
    const imgNode = document.createElement('img');
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'flex justify-center';
    imgWrapper.appendChild(imgNode);
    imgNode.src = imgUrl;
    [dayNode, tempNode, imgWrapper].forEach(n => div.appendChild(n));
    return div;
  }

  return forecastData.map(getOneDay);
}

function renderHTML(data) {
  const { name, country } = data.location;
  const tempText = data.current.temp_c;
  const { text: condition, icon } = data.current.condition;
  console.log(data.current.feelslike_c);
  const feelsLikeText = data.current.feelslike_c;
  feelslike.textContent = feelsLikeText;
  const url = icon.replace('64x64', '128x128');
  imgNode.src = `http://${url}`;
  const timeText = data.location.localtime.split(' ')[1];
  time.textContent = timeText;
  wind.textContent = data.current.wind_kph + ' km/h';
  temp.textContent = tempText + '°' + tempScale;
  city.textContent = `${name}, ${country}.`;
  content.classList.remove('hidden');
  conditionNode.textContent = condition;

  const forecastNode = document.createElement('div');
  forecastNode.className = 'flex w-full flex-col mt-10';
  const forecastArray = getForecastHtml(data.forecast.forecastday);
  forecastArray.forEach(d => {
    console.log(d);
    forecastNode.appendChild(d);
  });
  content.appendChild(forecastNode);
}

function showError(error) {
  console.log(error);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  getData(input.value).then(renderHTML).catch(showError);
});
