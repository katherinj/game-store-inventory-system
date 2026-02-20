const BASE = "/api/consoles";

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getAllConsoles() {
  const res = await fetch(BASE);
  return handle(res);
}

export async function createConsole(payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function updateConsole(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function deleteConsole(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return handle(res);
}

// q can be: { manufacturer: "sony" } OR { model: "ps5" }
export async function searchConsoles(q) {
  const params = new URLSearchParams(q);
  const res = await fetch(`${BASE}/search?${params.toString()}`);
  return handle(res);
}
