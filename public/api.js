export async function fetchCities() {
  const res = await fetch('/api/cities');
  if (!res.ok) {
    throw new Error('Failed to fetch citiessss');
  }
  return res.json();
}

export async function fetchFoodPlaces() {
  const res = await fetch('/api/food');
  if (!res.ok) {
    throw new Error('Failed to fetch citiessss');
  }
  return res.json();
}
