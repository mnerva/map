import { initMap, toggleMarkers } from './map.js';
import { fetchCities, fetchFoodPlaces, fetchBooks, fetchNature } from './api.js';

let map;

window.addEventListener('DOMContentLoaded', async () => {
  try {
    map = await initMap();

    const citiesBtn = document.getElementById('citiesBtn');
    const foodBtn = document.getElementById('foodBtn');
    const booksBtn = document.getElementById('booksBtn');
    const natureBtn = document.getElementById('natureBtn');
    const mapStyle = document.querySelector('.mapstyles-select')

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
          console.error('Failed to load food:', err);
        }
      });
    }

    if (booksBtn) {
      booksBtn.addEventListener('click', async () => {
        try {
          const books = await fetchBooks();
          toggleMarkers(map, books, 'books');
        } catch (err) {
          console.error('Failed to load books:', err);
        }
      });
    }

    if (natureBtn) {
      natureBtn.addEventListener('click', async () => {
        try {
          const nature = await fetchNature();
          toggleMarkers(map, nature, 'nature');
        } catch (err) {
          console.error('Failed to load nature:', err);
        }
      });
    }

    if (mapStyle) {
      mapStyle.addEventListener('change', (e) => {
        const style_code = e.target.value.split(".");
        style_code.length === 2 ?
          map.setStyle(maptilersdk.MapStyle[style_code[0]][style_code[1]]) :
          map.setStyle(maptilersdk.MapStyle[style_code[0]] || style_code[0]);
      });
    }
  } catch (err) {
    console.error('Failed to initialize map:', err);
  }
});
