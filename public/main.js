import { initMap, toggleMarkers } from './map.js';
import { fetchCities, fetchFoodPlaces, fetchBooks, fetchNature, fetchSearch } from './api.js';

let map;

window.addEventListener('DOMContentLoaded', async () => {
  try {
    map = await initMap();

    const citiesBtn = document.getElementById('citiesBtn');
    const foodBtn = document.getElementById('foodBtn');
    const booksBtn = document.getElementById('booksBtn');
    const natureBtn = document.getElementById('natureBtn');
    const mapStyle = document.querySelector('.mapstyles-select')

    const toggle = document.querySelector('#toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const wrapper = document.querySelector('#sidebarWrapper');
    const filterButtons = document.querySelectorAll('.buttons');

    const searchInput = document.getElementById("search");
    const suggestionsList = document.getElementById("suggestions");
  
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

    if (toggle) {
      toggle.addEventListener('click', () => {
        console.log('Toggle sidebar clicked');
        const isOpen = wrapper.classList.contains('open');
        wrapper.classList.toggle('open');
        sidebar.setAttribute('aria-hidden', isOpen);

        // Move toggle button and filter buttons
        const leftOffset = isOpen ? '0px' : '340px';
        toggle.style.left = leftOffset;
        if (filterButtons) {
          filterButtons.forEach(button => {
            button.style.left = leftOffset;
          });
        }
      });
    }

    document.querySelectorAll('.accordion-toggle').forEach(button => {
      button.addEventListener('click', async () => {
        const parent = button.parentElement;
        const content = parent.querySelector('.accordion-content');
        const type = parent.dataset.type;
    
        const isOpen = content.classList.contains('open');
        document.querySelectorAll('.accordion-content').forEach(c => {
          c.classList.remove('open');
          c.innerHTML = '';
        });
    
        if (!isOpen) {
          content.classList.add('open');
          let items;

          if (type === 'cities') {
            items = await fetchCities();
          } else if (type === 'food') {
            items = await fetchFoodPlaces();
          } else if (type === 'books') {
            items = await fetchBooks();
          } else if (type === 'nature') {
            items = await fetchNature();
          }
          content.innerHTML = items.map(item => `
            <div class="place-item" data-lat="${item.latitude}" data-lng="${item.longitude}">
              <div class="place-item-name">${item.name}</div>
              <div class="place-item-description" style="display: none;">${item.description}</div>
            </div>
          `).join('');
          // Add click event listener to zoom to marker
          content.querySelectorAll('.place-item').forEach(placeItem => {
            placeItem.addEventListener('click', (e) => {
              const lat = parseFloat(placeItem.dataset.lat);
              const lng = parseFloat(placeItem.dataset.lng);

              // Toggle the visibility of the description
              const descriptionElement = placeItem.querySelector('.place-item-description');
              const isVisible = descriptionElement.style.display === 'block';
              content.querySelectorAll('.place-item-description').forEach(desc => {
                desc.style.display = 'none';
              });
              descriptionElement.style.display = isVisible ? 'none' : 'block';

              map.flyTo({
                center: [lng, lat],
                zoom: 14,
                essential: true
              });
            });
          });
        }
      });
    });

    let debounceTimeout;

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
    
      clearTimeout(debounceTimeout);

      if (query.length < 2) {
        suggestionsList.innerHTML = "";
        return;
      }
    
      debounceTimeout = setTimeout(async () => {
        const results = await fetchSearch(query);
        showSuggestions(results);
      }, 300);
    });
    
    function showSuggestions(data) {
      console.log('data: ', data);

      suggestionsList.innerHTML = "";
    
      if (data.length === 0) {
        suggestionsList.innerHTML = "<li>No results found</li>";
        return;
      }
    
      data.forEach(place => {
        const li = document.createElement("li");
        li.textContent = `${place.name}`;
        li.dataset.lng = place.longitude;
        li.dataset.lat = place.latitude;
        console.log('created the li: ', li);

        li.addEventListener("click", () => {
          const lat = parseFloat(li.dataset.lat);
          const lng = parseFloat(li.dataset.lng);
          console.log('heard the click form the suggestion');
          suggestionsList.innerHTML = "";
          searchInput.value = place.name;
          map.flyTo({ 
            center: [lng, lat], 
            zoom: 14 
          });
        });
        suggestionsList.appendChild(li);
      });
    }
  } catch (err) {
    console.error('Failed to initialize map:', err);
  }
});
