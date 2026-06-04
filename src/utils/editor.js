export const EDITOR_STYLE_ID = "cat-editor-injected-style";

export const EDITOR_CSS = `
  [data-cat-hover]:not([data-cat-selected]) {
    outline: 2px dashed rgba(109, 94, 252, 0.55) !important;
    outline-offset: 1px;
    cursor: text;
  }
  [data-cat-selected] {
    outline: 2px solid #6d5efc !important;
    outline-offset: 1px;
  }
  img[data-cat-hover], img[data-cat-selected] { cursor: pointer; }
`;

export function stripScripts(html) {
  return (html || "").replace(/<script[\s\S]*?<\/script>/gi, "");
}

export function serializeDoc(doc) {
  if (!doc) return "";
  const clone = doc.documentElement.cloneNode(true);

  clone
    .querySelectorAll(`#${EDITOR_STYLE_ID}`)
    .forEach((n) => n.remove());
  clone
    .querySelectorAll("[data-cat-hover]")
    .forEach((n) => n.removeAttribute("data-cat-hover"));
  clone
    .querySelectorAll("[data-cat-selected]")
    .forEach((n) => n.removeAttribute("data-cat-selected"));
  clone
    .querySelectorAll("[contenteditable]")
    .forEach((n) => n.removeAttribute("contenteditable"));

  const doctype = doc.doctype
    ? `<!DOCTYPE ${doc.doctype.name}>`
    : "<!DOCTYPE html>";
  return `${doctype}\n${clone.outerHTML}`;
}

export function rgbToHex(value) {
  if (!value) return "#000000";
  if (value.startsWith("#")) return value;
  const m = value.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return "#000000";
  const [r, g, b] = m.map((n) => Math.round(Number(n)));
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function isTransparent(value) {
  if (!value) return true;
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return false;
  const parts = m[1].split(",").map((s) => Number(s.trim()));
  return parts.length === 4 && parts[3] === 0;
}

export function parsePx(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? Math.round(n) : 16;
}


export function findSectionRoot(el, doc) {
  if (!el || !doc) return null;
  const page = doc.querySelector(".page") || doc.body;
  let node = el;
  while (
    node &&
    node.parentElement &&
    node.parentElement !== page &&
    node.parentElement !== doc.body &&
    node.parentElement !== doc.documentElement
  ) {
    node = node.parentElement;
  }
  return node && node !== doc.body && node !== doc.documentElement
    ? node
    : el;
}

/** A short human label for an element, for the panel header. */
export function describeElement(el) {
  if (!el) return "";
  const tag = el.tagName.toLowerCase();
  if (tag === "img") return "Image";
  const cls = (el.getAttribute("class") || "")
    .split(/\s+/)
    .filter(Boolean)[0];
  return cls ? `${tag}.${cls}` : tag;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function downloadString(content, filename, type = "text/html") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const FONT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Space Grotesk', sans-serif", label: "Space Grotesk" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "'Courier New', monospace", label: "Courier New" },
  { value: "Verdana, sans-serif", label: "Verdana" },
];

export const FONT_SIZE_OPTIONS = [
  10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64,
];

// Pixel dimensions per page size at 96 DPI (matches the backend's mm sizes).
export const PAGE_PX = {
  A4: [794, 1123],
  A3: [1123, 1587],
  A2: [1587, 2245],
  Letter: [816, 1056],
};


export function applyStyleToSelection(doc, prop, val) {
  const win = doc.defaultView;
  const sel = win.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return false;
  const range = sel.getRangeAt(0);
  const span = doc.createElement("span");
  span.style[prop] = val;
  try {
    span.appendChild(range.extractContents());
    range.insertNode(span);
    sel.removeAllRanges();
    const r = doc.createRange();
    r.selectNodeContents(span);
    sel.addRange(r);
    return true;
  } catch {
    return false;
  }
}
