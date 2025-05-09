import { initMap, toggleMarkers } from './map.js';
import { fetchCities } from './api.js';
import { fetchFoodPlaces } from './api.js';

let map;

window.addEventListener('DOMContentLoaded', async () => {
  try {
    map = await initMap();

    const citiesBtn = document.getElementById('citiesBtn');
    const foodBtn = document.getElementById('foodBtn');

    if (citiesBtn) {
      citiesBtn.addEventListener('click', async () => {
        try {
          const cities = await fetchCities();
          toggleMarkers(map, cities, 'city');
        } catch (err) {
          console.error('Failed to load cities:', err);
        }
      });
    }

    if (foodBtn) {
      foodBtn.addEventListener('click', async () => {
        try {
          const foodPlaces = await fetchFoodPlaces();

          toggleMarkers(map, foodPlaces, 'food');
        } catch (err) {
          console.error('Failed to load cities:', err);
        }
      });
    }
  } catch (err) {
    console.error('Failed to initialize map:', err);
  }
});
