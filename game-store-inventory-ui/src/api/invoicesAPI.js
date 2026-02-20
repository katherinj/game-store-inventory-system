const BASE = "/api/invoices";

async function handle(res) {
  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      msg = data.message || data.error || msg;
    } catch {
      const text = await res.text();
      if (text) msg = text;
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function createInvoice(payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function getInvoices(params = {}) {
  const qs = new URLSearchParams();
  if (params.name) qs.set("name", params.name);
  if (params.state) qs.set("state", params.state);

  const url = qs.toString() ? `${BASE}?${qs}` : BASE;
  const res = await fetch(url);
  return handle(res);
}

export async function getInvoiceById(id) {
  const res = await fetch(`${BASE}/${id}`);
  return handle(res);
}
