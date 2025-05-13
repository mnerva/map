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

let markers = {
  city: [],
  food: [],
  books: []
};

let markersVisible = {
  city: false,
  food: false,
  books: false
};

export function toggleMarkers(map, items, type) {
  const markerColor = markerColors[type] || '#000000';

  const isVisible = markersVisible[type];

  if (isVisible) {
    // Remove markers
    markers[type].forEach(marker => marker.remove());
    markers[type] = [];
  } else {
    // Add markers
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'dot-marker';
      el.style.backgroundColor = markerColor;

      const marker = new maptilersdk.Marker({ element: el })
        .setLngLat([item.longitude, item.latitude])
        .setPopup(new maptilersdk.Popup().setText(item.name))
        .addTo(map);

      markers[type].push(marker);
    });
  }
  // Toggle visibility state
  markersVisible[type] = !markersVisible[type];
}