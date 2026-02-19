const BASE = "/api/games";

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function getAllGames() {
  return fetch(BASE).then(handle);
}

export function searchGames({ studio, title, esrb }) {
  const params = new URLSearchParams();
  if (studio) params.set("studio", studio);
  if (title) params.set("title", title);
  if (esrb) params.set("esrb", esrb);

  // if nothing provided, just return all
  if ([...params.keys()].length === 0) return getAllGames();

  return fetch(`${BASE}/search?${params.toString()}`).then(handle);
}

export function createGame(game) {
  return fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game),
  }).then(handle);
}

export function updateGame(id, game) {
  return fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game),
  }).then(handle);
}

export function deleteGame(id) {
  return fetch(`${BASE}/${id}`, { method: "DELETE" }).then(handle);
}
