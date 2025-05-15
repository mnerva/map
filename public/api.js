export async function fetchCities() {
  const res = await fetch('/api/cities');
  if (!res.ok) {
    throw new Error('Failed to fetch cities');
  }
  return res.json();
}

export async function fetchFoodPlaces() {
  const res = await fetch('/api/food');
  if (!res.ok) {
    throw new Error('Failed to fetch food places');
  }
  return res.json();
}

export async function fetchBooks() {
  const res = await fetch('/api/books');
  if (!res.ok) {
    throw new Error('Failed to fetch books');
  }
  return res.json();
}

export async function fetchNature() {
  const res = await fetch('/api/nature');
  if (!res.ok) {
    throw new Error('Failed to fetch nature');
  }
  return res.json();
}