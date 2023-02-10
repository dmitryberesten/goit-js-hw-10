import './css/styles.css';
import { fetchCountries } from './js/fetchCountries'; // отримання списку країн
import debounce from 'lodash.debounce'; // для затримки запиту
import Notiflix from 'notiflix'; // для сповіщень

// пошук елементів
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300; // затримка для запиту

// слхухач події для input
input.addEventListener(
  'input',
  debounce(e => {

    // очистка пробілів перед значенням та після
    const trimmedValue = input.value.trim();
    cleanHtml(); // очистка списку та інформації

    // перевірка від зворотнього - чи значення НЕ пусте
    if (trimmedValue !== '') {

      // отримання списку країн
      fetchCountries(trimmedValue).then(foundData => {

        // якщо знайдено більше 10 країн - виводимо сповіщення
        if (foundData.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );

          // якщо знайдено 0 країн - виводимо сповіщення
        } else if (foundData.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');

          // якщо знайдено >= 2 країн і <= 10 виводимо на сторінку дані
        } else if (foundData.length >= 2 && foundData.length <= 10) {

          renderCountryList(foundData); // вивід списку-країн на сторінку

          // якщо знайдена 1 країна - виводимо на сторінку 1 країну
        } else if (foundData.length === 1) {
          renderOneCountry(foundData); // вивід 1 країни на сторінку
        }
      });
    }
  }, DEBOUNCE_DELAY) // затримка для запиту
);

// вставлення розмітки на сторінку
function renderCountryList(countries) {

  // перебір країн з масиву об'єктів
  const markup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official
        }" width="30" hight="20">
         <p>${country.name.official}</p>
                </li>`;
    })
    .join(''); // сполучити рядки

  // вставлення li в ul на сторінку
  countryList.innerHTML = markup;
}

// вставлення розмітки 1 країни
function renderOneCountry(countries) {

  // перебір країни з масиву об'єктів
  const markup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official
        }" width="30" hight="20">
         <p>${country.name.official}</p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                </li>`;
    })
    .join(''); // сполучити рядки

  // вставлення li в ul на сторінку
  countryList.innerHTML = markup;
}

// очистка списку країн та інформації про країну
function cleanHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
