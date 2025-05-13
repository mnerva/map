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

  // Create GeoJSON data for the markers
  const geojson = {
    type: 'FeatureCollection',
    features: items.map(item => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [item.longitude, item.latitude],
      },
      properties: {
        title: item.name,
      },
    })),
  };

  // Remove the existing layer if it's already visible
  if (markersVisible[type]) {
    map.removeLayer(`${type}-markers`);
    map.removeSource(`${type}-markers`);
    markersVisible[type] = false;
  } else {
    // Add a new layer for the markers
    map.addSource(`${type}-markers`, {
      type: 'geojson',
      data: geojson,
    });

    map.addLayer({
      id: `${type}-markers`,
      type: 'circle',
      source: `${type}-markers`,
      paint: {
        'circle-radius': 6,
        'circle-color': markerColor,
        'circle-opacity': 0.9,
      },
    });

    markersVisible[type] = true;

    // Add click event listener to show popups
    map.on('click', `${type}-markers`, (e) => {
      const feature = e.features[0];
      const popup = new maptilersdk.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`<h3>${feature.properties.title}</h3>`)
        .addTo(map);
    });
  }
}