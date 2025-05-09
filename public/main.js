import { initMap, addCityMarkers } from './map.js';
import { fetchCities } from './api.js';

let map;

window.addEventListener('DOMContentLoaded', async () => {
  try {
    map = await initMap();

    const citiesBtn = document.getElementById('citiesBtn');
    if (citiesBtn) {
      console.log('Cities button there!!?');
      citiesBtn.addEventListener('click', async () => {
        console.log('Cities button clicked');
        try {
          const cities = await fetchCities();
          console.log('Cities:', cities);
          addCityMarkers(map, cities);
        } catch (err) {
          console.error('Failed to load cities:', err);
        }
      });
    }
  } catch (err) {
    console.error('Failed to initialize map:', err);
  }
});
