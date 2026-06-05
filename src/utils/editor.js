export const EDITOR_STYLE_ID = "cat-editor-injected-style";

export const CAT_UI_ATTR = "data-cat-ui";

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
  [${CAT_UI_ATTR}] { box-sizing: border-box; }
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
    .querySelectorAll(`[${CAT_UI_ATTR}]`)
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

export function sectionContainer(doc) {
  return doc?.querySelector(".page") || doc?.body || null;
}

export function getSections(doc) {
  const container = sectionContainer(doc);
  if (!container) return [];
  return Array.from(container.children).filter(
    (n) => n.nodeType === 1 && !n.hasAttribute(CAT_UI_ATTR)
  );
}

export function moveSection(section, dir) {
  if (!section) return false;
  const parent = section.parentElement;
  if (!parent) return false;
  let sib = section;
  do {
    sib = dir < 0 ? sib.previousElementSibling : sib.nextElementSibling;
  } while (sib && sib.hasAttribute(CAT_UI_ATTR));
  if (!sib) return false;
  if (dir < 0) parent.insertBefore(section, sib);
  else parent.insertBefore(sib, section);
  return true;
}


function scrubEditorAttrs(node) {
  if (node.nodeType !== 1) return;
  ["data-cat-selected", "data-cat-hover", CAT_UI_ATTR].forEach((a) =>
    node.removeAttribute(a)
  );
  node
    .querySelectorAll("[data-cat-selected],[data-cat-hover],[" + CAT_UI_ATTR + "]")
    .forEach((n) => {
      n.removeAttribute("data-cat-selected");
      n.removeAttribute("data-cat-hover");
      n.removeAttribute(CAT_UI_ATTR);
    });
}


export function duplicateElement(el) {
  if (!el || !el.parentNode) return null;
  const clone = el.cloneNode(true);
  scrubEditorAttrs(clone);
  el.parentNode.insertBefore(clone, el.nextSibling);
  return clone;
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='160'>" +
      "<rect width='100%' height='100%' fill='#e9e7f5'/>" +
      "<text x='50%' y='50%' font-family='sans-serif' font-size='16' fill='#8b86b8' " +
      "text-anchor='middle' dominant-baseline='middle'>Image</text></svg>"
  );

export function createBlock(doc, type) {
  let el;
  switch (type) {
    case "heading":
      el = doc.createElement("h2");
      el.textContent = "New heading";
      el.style.cssText = "margin:0;font-size:20px;";
      break;
    case "image":
      el = doc.createElement("img");
      el.setAttribute("src", PLACEHOLDER_IMG);
      el.setAttribute("alt", "");
      el.style.cssText = "display:block;max-width:100%;width:240px;height:auto;";
      break;
    case "button":
      el = doc.createElement("a");
      el.setAttribute("href", "#");
      el.textContent = "Button";
      el.style.cssText =
        "display:inline-block;padding:8px 16px;border-radius:8px;" +
        "background:#6d5efc;color:#fff;text-decoration:none;font-weight:600;font-size:13px;";
      break;
    case "text":
    default:
      el = doc.createElement("p");
      el.textContent = "New text — click to edit.";
      el.style.cssText = "margin:0;font-size:13px;line-height:1.5;";
      break;
  }
  return el;
}

export function createStarterSection(doc) {
  const container = sectionContainer(doc);
  if (!container) return null;
  const section = doc.createElement("section");
  section.style.cssText =
    "padding:24px;display:flex;flex-direction:column;gap:8px;color:inherit;";
  const heading = createBlock(doc, "heading");
  heading.textContent = "New section";
  const text = createBlock(doc, "text");
  text.textContent =
    "Click to edit this text. Use the panel to set a background, size, and order.";
  section.append(heading, text);
  container.appendChild(section);
  return section;
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

const ACCENT = "#6d5efc";


export function createSectionOverlay(doc, { onChange } = {}) {
  const win = doc.defaultView;
  let target = null;       
  let mode = null;        
  let start = null;        

  const overlay = doc.createElement("div");
  overlay.id = "cat-section-overlay";
  overlay.setAttribute(CAT_UI_ATTR, "");
  overlay.setAttribute("contenteditable", "false");
  Object.assign(overlay.style, {
    position: "absolute",
    left: "0",
    top: "0",
    margin: "0",
    padding: "0",
    pointerEvents: "none",  
    zIndex: "2147483646",
    display: "none",
  });

  const ring = doc.createElement("div");
  ring.setAttribute(CAT_UI_ATTR, "");
  Object.assign(ring.style, {
    position: "absolute",
    inset: "0",
    border: `1.5px solid ${ACCENT}`,
    borderRadius: "3px",
    pointerEvents: "none",
  });
  overlay.appendChild(ring);

  function makeHandle(kind, cursor) {
    const h = doc.createElement("div");
    h.setAttribute(CAT_UI_ATTR, "");
    h.dataset.kind = kind;
    Object.assign(h.style, {
      position: "absolute",
      width: "14px",
      height: "14px",
      background: ACCENT,
      border: "2px solid #fff",
      borderRadius: "50%",
      boxShadow: "0 1px 4px rgba(0,0,0,.35)",
      pointerEvents: "auto",
      cursor,
    });
    overlay.appendChild(h);
    return h;
  }
  const hE = makeHandle("e", "ew-resize");
  const hS = makeHandle("s", "ns-resize");
  const hSE = makeHandle("se", "nwse-resize");

  const moveTab = doc.createElement("div");
  moveTab.setAttribute(CAT_UI_ATTR, "");
  moveTab.dataset.kind = "move";
  moveTab.textContent = "⠿ drag to move";
  Object.assign(moveTab.style, {
    position: "absolute",
    top: "-26px",
    left: "0",
    height: "22px",
    padding: "0 9px",
    display: "inline-flex",
    alignItems: "center",
    background: ACCENT,
    color: "#fff",
    font: "600 11px/22px system-ui, sans-serif",
    borderRadius: "11px",
    whiteSpace: "nowrap",
    pointerEvents: "auto",
    cursor: "grab",
    userSelect: "none",
  });
  overlay.appendChild(moveTab);

  doc.body.appendChild(overlay);

  function place(handle, x, y) {
    handle.style.left = `${x - 7}px`;
    handle.style.top = `${y - 7}px`;
  }

  function reposition() {
    if (!target || !target.isConnected) {
      overlay.style.display = "none";
      return;
    }
    const r = target.getBoundingClientRect();
    const left = r.left + win.scrollX;
    const top = r.top + win.scrollY;
    Object.assign(overlay.style, {
      display: "block",
      left: `${left}px`,
      top: `${top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });
    place(hE, r.width, r.height / 2);
    place(hS, r.width / 2, r.height);
    place(hSE, r.width, r.height);
  }

  function onMove(e) {
    if (!mode || !target) return;
    if (mode === "move") {
      reorderToPointer(e.clientY);
      reposition();
      return;
    }
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (mode === "e" || mode === "se") {
      target.style.width = `${Math.max(40, Math.round(start.w + dx))}px`;
    }
    if (mode === "s" || mode === "se") {
      target.style.height = `${Math.max(24, Math.round(start.h + dy))}px`;
      target.style.flex = "none"; // make the explicit height stick inside flex layouts
    }
    reposition();
  }

  function reorderToPointer(clientY) {
    const sections = getSections(doc);
    const i = sections.indexOf(target);
    if (i === -1) return;
    const prev = sections[i - 1];
    const next = sections[i + 1];
    if (prev) {
      const pr = prev.getBoundingClientRect();
      if (clientY < pr.top + pr.height / 2) {
        prev.parentElement.insertBefore(target, prev);
        return;
      }
    }
    if (next) {
      const nr = next.getBoundingClientRect();
      if (clientY > nr.top + nr.height / 2) {
        next.parentElement.insertBefore(next, target);
      }
    }
  }

  function onUp() {
    if (!mode) return;
    mode = null;
    start = null;
    moveTab.style.cursor = "grab";
    win.removeEventListener("pointermove", onMove, true);
    win.removeEventListener("pointerup", onUp, true);
    onChange?.();
  }

  function onDown(e) {
    const kind = e.target?.dataset?.kind;
    if (!kind || !target) return;
    e.preventDefault();
    e.stopPropagation();
    mode = kind;
    const r = target.getBoundingClientRect();
    start = { x: e.clientX, y: e.clientY, w: r.width, h: r.height };
    if (kind === "move") moveTab.style.cursor = "grabbing";
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    win.addEventListener("pointermove", onMove, true);
    win.addEventListener("pointerup", onUp, true);
  }

  overlay.addEventListener("pointerdown", onDown, true);

  return {
    setTarget(el) {
      target = el || null;
      reposition();
    },
    reposition,
    isDragging() {
      return mode !== null;
    },
    destroy() {
      win.removeEventListener("pointermove", onMove, true);
      win.removeEventListener("pointerup", onUp, true);
      overlay.remove();
    },
  };
}
