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
    projectionControl: true,
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
  const sourceId = `${type}-markers`;
  const layerId = `${type}-markers`;

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
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
    markersVisible[type] = false;
    return
  }
  
  // Ensure map style is loaded before adding
  if (!map.isStyleLoaded()) {
    map.once('styledata', () => toggleMarkers(map, items, type));
    return;
  }

  // Add source + layer
  map.addSource(sourceId, {
    type: 'geojson',
    data: geojson,
  });

  map.addLayer({
    id: layerId,
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-radius': 6,
      'circle-color': markerColor,
      'circle-opacity': 0.9,
    },
  });

  markersVisible[type] = true;

  map.on('click', layerId, (e) => {
    const feature = e.features[0];
    new maptilersdk.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(`<h3>${feature.properties.title}</h3>`)
      .addTo(map);
  });
}