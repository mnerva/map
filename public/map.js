// Function to initialize the map
fetch('/api/map-tiler')
  .then(res => {
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  })
  .then(data => {
    maptilersdk.config.apiKey = data.apiKey;
    const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.STREETS,
      projection: 'globe',
      center: [0, 40],
      zoom: 2,
    });
  });
