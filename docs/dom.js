function DOM() {
  const loader = document.querySelector('.loader');
  const svg = document.querySelector('svg');
  const button = document.querySelector('button');
  const input = document.querySelector('input');
  let isDataShown = false;
  let tempScale = 'celsius';

  function switchTempScale() {
    tempScale = tempScale === 'celsius' ? 'fahrenheit' : 'celsius';
  }

  function showLoader() {
    loader.style.display = 'flex';
    return Promise.resolve(1);
  }

  function hideLoader() {
    loader.style.display = 'none';
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
      let celciusClass, fahrenheitClass;
      if (tempScale === 'celsius') {
        fahrenheitClass = 'hidden';
      } else {
        celciusClass = 'hidden';
      }
      const dayIndex = new Date(dayData.date).getDay();
      const day = days[dayIndex];
      const div = document.createElement('div');
      div.className =
        'flex gap-2 justify-between items-center font-bold [&>*]:w-full [&>*]:text-center border-y border-gray';
      const dayNode = document.createElement('p');
      dayNode.textContent = day;
      const tempC = dayData.day.avgtemp_c;
      const tempF = dayData.day.avgtemp_f;
      const tempNodeC = document.createElement('p');
      const tempNodeF = document.createElement('p');
      tempNodeC.textContent = tempC + ' C°';
      tempNodeF.textContent = tempF + ' F°';
      tempNodeC.classList.add(celciusClass);
      tempNodeC.id = 'cel';
      tempNodeF.classList.add(fahrenheitClass);
      tempNodeF.id = 'fah';
      const imgUrl = new URL(`http://${dayData.day.condition.icon}`);
      const imgNode = document.createElement('img');
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'flex justify-center';
      imgWrapper.appendChild(imgNode);
      imgNode.src = imgUrl;
      [dayNode, tempNodeC, tempNodeF, imgWrapper].forEach(n =>
        div.appendChild(n)
      );
      return div;
    }
    return forecastData.map(getOneDay);
  }

  function renderHTML(data) {
    if (document.querySelector('#error')) {
      document.querySelector('#error').remove();
      const content = document.createElement('div');
      content.id = 'content';
      content.className =
        'py-4 px-7 flex flex-col justify-center items-center hidden';
      container.appendChild(content);
    }
    let celciusClass, fahrenheitClass;
    if (tempScale === 'celsius') {
      fahrenheitClass = 'hidden';
    } else {
      celciusClass = 'hidden';
    }
    const currentHeight = content.offsetHeight;
    content.classList.remove('hidden');
    content.innerHtml = '';
    const { name, country } = data.location;
    const tempC = data.current.temp_c;
    const tempF = data.current.temp_f;
    const { text: condition, icon } = data.current.condition;
    const feelsLikeC = data.current.feelslike_c;
    const feelsLikeF = data.current.feelslike_f;
    const windM = data.current.wind_mph;
    const windK = data.current.wind_kph;
    const url = icon.replace('64x64', '128x128');
    const timeText = data.location.localtime.split(' ')[1];
    const html = `
	<p id="city" class="text-2xl uppercase text-center">${name}, ${country}</p>
	<p id="cel" class="text-5xl ${celciusClass}">${tempC} C°</p>
	<p id="fah" class="text-5xl ${fahrenheitClass}">${tempF} F°</p>
	<p id="condition" class="mt-4 text-2xl">${condition}</p>
	<img src="${url}" alt="" />
	<div
	  id="additional-info"
	  class="[&>*]:w-full w-full text-center font-bold uppercase text-xl flex justify-between gap-5"
	>
	  <div id="feelslike">
		<p class="text-xl">Feels Like</p>
		<p id="cel" class="text-center text-xl ${celciusClass}">${feelsLikeC} C°</p>
		<p id="fah" class="text-center text-xl ${fahrenheitClass}">${feelsLikeF} F°</p>
	  </div>
	  <div id="time">
		<p>Local Time</p>
		<p class="text-xl text-center" id="time__value">${timeText}</p>
	  </div>
	  <div id="wind">
		<p>Wind</p>
		<p id="cel" class="text-xl text-center ${celciusClass}" id="wind__value">${windK} km/h</p>
		<p id="fah" class="text-xl text-center ${fahrenheitClass}" id="wind__value">${windM} mph</p>
	  </div>
	</div>`;

    const forecastNode = document.createElement('div');
    forecastNode.className = 'flex w-full flex-col mt-10';
    const forecastArray = getForecastHtml(data.forecast.forecastday);
    forecastArray.forEach(d => {
      forecastNode.appendChild(d);
    });
    content.innerHTML = html;
    content.appendChild(forecastNode);
    isDataShown = true;
  }

  svg.addEventListener('click', e => {
    input.focus();
  });

  function clearInput() {
    input.value = '';
    input.blur();
  }

  function buttonHandler(e) {
    switchTempScale();
    const letters = e.currentTarget.querySelectorAll('span');
    [...letters].forEach(l => l.classList.toggle('inactive'));
    if (!isDataShown) return;
    const cels = document.querySelectorAll('#cel');
    const fahs = document.querySelectorAll('#fah');
    [...cels, ...fahs].forEach(n => n.classList.toggle('hidden'));
  }

  function renderError(err) {
    console.log(err);
    while (container.children.length !== 1) {
      container.children[1].remove();
    }
    const div = document.createElement('div');
    div.className = 'p-2 text-bold';
    div.id = 'error';
    const p = document.createElement('p');
    p.textContent = 'No matches found. Try another query!';
    isDataShown = false;
    div.appendChild(p);
    container.appendChild(div);
  }

  button.addEventListener('click', buttonHandler);

  return {
    switchTempScale,
    renderHTML,
    showLoader,
    hideLoader,
    renderError,
    clearInput
  };
}

export { DOM };
