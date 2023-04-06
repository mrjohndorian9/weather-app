import { DOM } from './dom.js';
const input = document.querySelector('input');
const form = document.querySelector('form');
const domController = DOM();
let buffer = 1;

async function getData(place) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=915ce40b87ca4f7381a183907232903&q=${place}&aqi=no&days=7`;
  const response = await fetch(url, { mode: 'cors' });
  const data = await response.json();
  return data;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  domController
    .showLoader()
    .then(e => getData(input.value))
    .then(domController.renderHTML)
    .then(s => domController.clearInput())
    .catch(domController.renderError)
    .finally(e => domController.hideLoader());
});
