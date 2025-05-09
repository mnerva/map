export async function fetchCities() {
  console.log('Fetching cities...');
  const res = await fetch('/api/cities');
  console.log('Response:', res);
  if (!res.ok) {
    console.log('res:', res);
    throw new Error('Failed to fetch citiessss');
  }
  return res.json();
}
