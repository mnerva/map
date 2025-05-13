export async function initMap() {
  const res = await fetch('/api/map-tiler');
  if (!res.ok) {
    throw new Error('Failed to fetch API key');
  }
  const data = await res.json();

  maptilersdk.config.apiKey = data.apiKey;

  const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    projection: 'globe',
    center: [0, 40],
    zoom: 2,
  });

  return map;
}

const markerColors = {
  city: '#8b826c',
  food: '#694f40',
  books: '#4f6940',
}

let cityMarkers = [];
let foodMarkers = [];
let booksMarkers = [];
let cityMarkersVisible = false;
let foodMarkersVisible = false;
let booksMarkersVisible = false;

export function toggleMarkers(map, items, type) {
  const markerColor = markerColors[type] || '#000000';

  if (type === 'city') {
    if (cityMarkersVisible) {
      // Remove city markers
      cityMarkers.forEach(marker => marker.remove());
      cityMarkers = [];  // Clear city markers
    } else {
      // Add city markers
      items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'dot-marker';
        el.style.backgroundColor = markerColor;

        const marker = new maptilersdk.Marker({ element: el })
          .setLngLat([item.longitude, item.latitude])
          .setPopup(new maptilersdk.Popup().setText(item.name))
          .addTo(map);

        cityMarkers.push(marker);  // Store the city marker
      });
    }
    // Toggle visibility state
    cityMarkersVisible = !cityMarkersVisible;
  }

  if (type === 'food') {
    if (foodMarkersVisible) {
      // Remove food markers
      foodMarkers.forEach(marker => marker.remove());
      foodMarkers = [];  // Clear food markers
    } else {
      console.log('Adding food markers');
      // Add food markers
      items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'dot-marker';
        el.style.backgroundColor = markerColor;

        const marker = new maptilersdk.Marker({ element: el })
          .setLngLat([item.longitude, item.latitude])
          .setPopup(new maptilersdk.Popup().setText(item.name))
          .addTo(map);

        foodMarkers.push(marker);  // Store the food marker
      });
    }
    // Toggle visibility state
    foodMarkersVisible = !foodMarkersVisible;
  }

  if (type === 'books') {
    if (booksMarkersVisible) {
      // Remove food markers
      booksMarkers.forEach(marker => marker.remove());
      booksMarkers = [];  // Clear food markers
    } else {
      // Add food markers
      items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'dot-marker';
        el.style.backgroundColor = markerColor;

        const marker = new maptilersdk.Marker({ element: el })
          .setLngLat([item.longitude, item.latitude])
          .setPopup(new maptilersdk.Popup().setText(item.name))
          .addTo(map);

        booksMarkers.push(marker);  // Store the food marker
      });
    }
    // Toggle visibility state
    booksMarkersVisible = !booksMarkersVisible;
  }
}