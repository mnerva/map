export async function initMap() {
  const res = await fetch('/map-tiler');
  console.log('res', res);
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

  // Reset markersVisible when the style changes
  map.on('style.load', () => {
    Object.keys(markersVisible).forEach(type => {
      markersVisible[type] = false;
    });
  });
  
  return map;
}

const markerColors = {
  city: '#8b826c',
  food: '#694f40',
  books: '#4f6940',
  nature: '#4f4069',
}

let markers = {
  city: [],
  food: [],
  books: [],
  nature: []
};

let markersVisible = {
  city: false,
  food: false,
  books: false,
  nature: false
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
        description: item.description || '',
      },
    })),
  };

  // Remove the existing layer if it's already visible
  if (markersVisible[type]) {
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    items.forEach(item => {
      const polygonLayerId = `polygon-${type}-${item.id}`;
      const polygonSourceId = `polygon-${type}-${item.id}`;
      if (map.getLayer(polygonLayerId)) map.removeLayer(polygonLayerId);
      if (map.getSource(polygonSourceId)) map.removeSource(polygonSourceId);
    });

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

  items.forEach(item => {
    if (item.polygon) {
      const polygonSourceId = `polygon-${type}-${item.id}`;
      const polygonLayerId = `polygon-${type}-${item.id}`;

      map.addSource(polygonSourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: item.polygon,
          properties: {},
        },
      });

      map.addLayer({
        id: polygonLayerId,
        type: 'line',
        source: polygonSourceId,
        paint: {
          'line-color': markerColor,
          'line-opacity': 1,
        },
      });
    }
  });

  markersVisible[type] = true;

  map.on('click', layerId, (e) => {
    const feature = e.features[0];
    const title = feature.properties.title;
    const description = feature.properties.description || '';

    const popupContent = `
      <div>
        <h3>${title}</h3>
        ${description ? `<p>${description}</p>` : ''}
      </div>
    `;

    new maptilersdk.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(popupContent)
      .addTo(map);
  });

}
