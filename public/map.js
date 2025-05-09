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

export function addCityMarkers(map, cities) {
  console.log("i am in the addCityMarkers function")
  cities.forEach(city => {
    new maptilersdk.Marker()
      .setLngLat([city.longitude, city.latitude])
      .setPopup(new maptilersdk.Popup().setText(city.name))
      .addTo(map);
  });
}