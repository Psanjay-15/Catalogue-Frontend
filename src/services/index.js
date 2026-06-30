/**
 * The app's single API surface. Components import from here only - they never
 * touch axios directly. Each function maps to one backend endpoint.
 *
 *   Templates:
 *     GET  /api/v1/templates           -> [{ id, name, description, kind, sample_html }]
 *     GET  /api/v1/templates/{id}      -> single template (with sample_html)
 *   Catalogs:
 *     POST /api/v1/catalogs                      -> 202 { id, status, ... }
 *     GET  /api/v1/catalogs/{id}                 -> status (+ html when done)
 *     GET  /api/v1/catalogs/{id}/html            (html)
 *     GET  /api/v1/catalogs/{id}/pdf             (file)
 */
import axios from "axios";

export const API_ORIGIN =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_BASE = `${API_ORIGIN}/api/v1`;

axios.defaults.timeout = 30000;

export function toErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.detail) {
    if (Array.isArray(data.detail)) {
      return data.detail.map((d) => d.msg || JSON.stringify(d)).join("; ");
    }
    return String(data.detail);
  }
  if (data?.error) return `${data.error}: ${data.detail ?? ""}`.trim();
  return error?.message || "Something went wrong. Please try again.";
}


export async function listTemplates() {
  const { data } = await axios.get(`${API_BASE}/templates`);
  return data.map((t) => ({ ...t, sampleHtml: t.sample_html }));
}

export async function getTemplate(id) {
  const { data } = await axios.get(`${API_BASE}/templates/${id}`);
  return { ...data, sampleHtml: data.sample_html };
}


export async function createCatalog(payload) {
  const { data } = await axios.post(`${API_BASE}/catalogs`, payload);
  return data;
}

export async function extractTextFromFile(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await axios.post(`${API_BASE}/catalogs/extract`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return data; 
}

export async function getCatalog(id) {
  const { data } = await axios.get(`${API_BASE}/catalogs/${id}`);
  return data;
}


export async function updateCatalogHtml(id, html) {
  const { data } = await axios.put(
    `${API_BASE}/catalogs/${id}/html`,
    { html },
    { timeout: 120000 }
  );
  return data;
}

export function catalogHtmlUrl(id) {
  return `${API_ORIGIN}/api/v1/catalogs/${id}/html`;
}

export function catalogPdfUrl(id) {
  return `${API_ORIGIN}/api/v1/catalogs/${id}/pdf`;
}



export async function listSavedCatalogs() {
  const { data } = await axios.get(`${API_BASE}/catalogs/saved`);
  return data;
}


export async function saveCatalog(id, { title, html } = {}) {
  const { data } = await axios.post(
    `${API_BASE}/catalogs/${id}/save`,
    { title, html },
    { timeout: 120000 }
  );
  return data;
}

export async function unsaveCatalog(id) {
  const { data } = await axios.delete(`${API_BASE}/catalogs/${id}/save`);
  return data;
}
