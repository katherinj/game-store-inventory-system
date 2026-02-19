const BASE = "/api/tshirts";

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

export async function getAllTShirts() {
  const res = await fetch(BASE);
  return handle(res);
}

export async function createTShirt(payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function updateTShirt(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function deleteTShirt(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return handle(res);
}

// q can be: { color: "black" } OR { size: "m" } OR { description: "retro" } OR { color: "black", size: "m" }
export async function searchTShirts(q) {
  const params = new URLSearchParams(q);
  const res = await fetch(`${BASE}/search?${params.toString()}`);
  return handle(res);
}
