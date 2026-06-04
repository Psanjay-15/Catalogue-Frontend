import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FiSave,
  FiDownload,
  FiExternalLink,
  FiEdit3,
  FiEye,
  FiCheckCircle,
  FiBookmark,
  FiX,
} from "react-icons/fi";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { EditorToolbar } from "./EditorToolbar";
import { ElementPanel } from "./ElementPanel";
import {
  updateCatalogHtml,
  saveCatalog,
  toErrorMessage,
  catalogPdfUrl,
} from "../../services";
import {
  EDITOR_CSS,
  EDITOR_STYLE_ID,
  PAGE_PX,
  applyStyleToSelection,
  downloadString,
  readFileAsDataUrl,
  serializeDoc,
  stripScripts,
  findSectionRoot,
} from "../../utils/editor";


const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  h1 {
    font-size: clamp(20px, 3vw, 26px);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

const ModeToggle = styled.div`
  display: inline-flex;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 3px;

  button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    background: transparent;
    padding: 7px 14px;
    border-radius: ${({ theme }) => theme.radii.pill};
    font-size: 13.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.base};

    &[data-active="true"] {
      background: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.primaryDark};
      box-shadow: ${({ theme }) => theme.shadows.xs};
    }
  }
`;

const Workspace = styled.div`
  display: grid;
  grid-template-columns: ${({ $editing }) => ($editing ? "1fr 300px" : "1fr")};
  gap: 20px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Stage = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  overflow: auto;
  display: flex;
  justify-content: center;
  box-shadow: inset 0 2px 14px rgba(16, 14, 34, 0.05);
`;

const ScaleWrap = styled.div`
  flex-shrink: 0;
`;

const PaperFrame = styled.iframe`
  border: 0;
  background: #fff;
  display: block;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border-radius: 4px;
  transform-origin: top center;
`;

const Hint = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 12px;
`;

const SaveNote = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.success};
  display: inline-flex;
  align-items: center;
  gap: 6px;

  a {
    color: ${({ theme }) => theme.colors.primaryDark};
    font-weight: 600;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;


const SaveWrap = styled.div`
  position: relative;
`;

const LibPopover = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  z-index: 40;
  width: 320px;
  text-align: left;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: 16px;

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .head strong {
    font-size: 14px;
  }
  .head button {
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    display: inline-flex;
    padding: 2px;
    border-radius: ${({ theme }) => theme.radii.sm};
    &:hover {
      background: ${({ theme }) => theme.colors.surfaceAlt};
      color: ${({ theme }) => theme.colors.text};
    }
  }
  label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 6px;
  }
  input {
    width: 100%;
    padding: 9px 11px;
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: 14px;
    font-family: ${({ theme }) => theme.fonts.sans};
    margin-bottom: 12px;
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
  .err {
    color: ${({ theme }) => theme.colors.danger};
    font-size: 12.5px;
    margin-bottom: 10px;
  }
`;

export function CatalogEditor({ catalog, onSaved }) {
  const iframeRef = useRef(null);
  const stageRef = useRef(null);
  const lastRangeRef = useRef(null); 
  const setupDoneRef = useRef(false);

  const [editing, setEditing] = useState(true);
  const [selectedEl, setSelectedEl] = useState(null);
  const [, setTick] = useState(0); 
  const [scale, setScale] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

  const [libOpen, setLibOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [libSaving, setLibSaving] = useState(false);
  const [libError, setLibError] = useState(null);
  const [librarySaved, setLibrarySaved] = useState(false);

  const [pageW, pageH] = PAGE_PX[catalog.page_size] || PAGE_PX.A4;

  const initialHtmlRef = useRef(stripScripts(catalog.html || ""));

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const getDoc = useCallback(() => iframeRef.current?.contentDocument || null, []);

  const selectElement = useCallback((el) => {
    const doc = el?.ownerDocument;
    if (!doc) return;
    doc
      .querySelectorAll("[data-cat-selected]")
      .forEach((n) => n.removeAttribute("data-cat-selected"));
    if (el && el !== doc.body && el !== doc.documentElement) {
      el.setAttribute("data-cat-selected", "");
      setSelectedEl(el);
    } else {
      setSelectedEl(null);
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const doc = getDoc();
    if (!doc) return;
    const win = doc.defaultView;
    win.focus();
    const sel = win.getSelection();
    if (lastRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(lastRangeRef.current);
    }
  }, [getDoc]);

  const handleIframeLoad = useCallback(() => {
    const doc = getDoc();
    if (!doc || setupDoneRef.current) return;
    setupDoneRef.current = true;

    const style = doc.createElement("style");
    style.id = EDITOR_STYLE_ID;
    style.textContent = EDITOR_CSS;
    doc.head.appendChild(style);

    doc.designMode = "on";

    const isEditing = () => iframeRef.current?.dataset.editing === "true";

    doc.addEventListener(
      "mouseover",
      (e) => {
        if (!isEditing()) return;
        const el = e.target;
        if (el && el.nodeType === 1 && el !== doc.body) {
          el.setAttribute("data-cat-hover", "");
        }
      },
      true
    );
    doc.addEventListener(
      "mouseout",
      (e) => {
        const el = e.target;
        if (el && el.nodeType === 1) el.removeAttribute("data-cat-hover");
      },
      true
    );
    doc.addEventListener(
      "click",
      (e) => {
        if (!isEditing()) return;
        const el = e.target;
        if (el && el.nodeType === 1) selectElement(el);
      },
      true
    );
    doc.addEventListener("selectionchange", () => {
      const sel = doc.defaultView.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        lastRangeRef.current = sel.getRangeAt(0).cloneRange();
      }
    });

    fitToStage();
  }, [getDoc, selectElement]);

  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = getDoc();
    if (iframe) iframe.dataset.editing = String(editing);
    if (!doc) return;
    doc.designMode = editing ? "on" : "off";
    const style = doc.getElementById(EDITOR_STYLE_ID);
    if (style) style.disabled = !editing;
    if (!editing) {
      doc
        .querySelectorAll("[data-cat-selected],[data-cat-hover]")
        .forEach((n) => {
          n.removeAttribute("data-cat-selected");
          n.removeAttribute("data-cat-hover");
        });
      setSelectedEl(null);
    }
  }, [editing, getDoc]);

  const fitToStage = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const available = stage.clientWidth - 48; // minus padding
    const next = Math.min(1, available / pageW);
    setScale(next > 0 ? next : 1);
  }, [pageW]);

  useLayoutEffect(() => {
    fitToStage();
    window.addEventListener("resize", fitToStage);
    return () => window.removeEventListener("resize", fitToStage);
  }, [fitToStage]);

  const exec = useCallback(
    (command, value = null) => {
      const doc = getDoc();
      if (!doc) return;
      restoreSelection();
      try {
        doc.execCommand("styleWithCSS", false, true);
      } catch {
        /* not all engines support this; ignore */
      }
      doc.execCommand(command, false, value);
      refresh();
    },
    [getDoc, restoreSelection, refresh]
  );

  const setSelectionFontSize = useCallback(
    (px) => {
      const doc = getDoc();
      if (!doc) return;
      restoreSelection();
      const applied = applyStyleToSelection(doc, "fontSize", `${px}px`);
      if (!applied && selectedEl) selectedEl.style.fontSize = `${px}px`;
      refresh();
    },
    [getDoc, restoreSelection, selectedEl, refresh]
  );

  const setSelectionFont = useCallback(
    (family) => {
      const doc = getDoc();
      if (!doc) return;
      restoreSelection();
      if (family) {
        const applied = applyStyleToSelection(doc, "fontFamily", family);
        if (!applied && selectedEl) selectedEl.style.fontFamily = family;
      }
      refresh();
    },
    [getDoc, restoreSelection, selectedEl, refresh]
  );

  const updateElementStyle = useCallback(
    (prop, value) => {
      if (!selectedEl) return;
      if (value === "" || value == null) selectedEl.style.removeProperty(prop);
      else selectedEl.style.setProperty(prop, value);
      refresh();
    },
    [selectedEl, refresh]
  );

  const selectParent = useCallback(() => {
    if (!selectedEl) return;
    const parent = selectedEl.parentElement;
    const doc = getDoc();
    if (parent && parent !== doc.body && parent !== doc.documentElement) {
      selectElement(parent);
    }
  }, [selectedEl, getDoc, selectElement]);

  const deleteElement = useCallback(() => {
    if (!selectedEl) return;
    selectedEl.remove();
    setSelectedEl(null);
  }, [selectedEl]);

  const deleteSection = useCallback(() => {
    const doc = getDoc();
    if (!selectedEl || !doc) return;
    const section = findSectionRoot(selectedEl, doc);
    if (section) section.remove();
    setSelectedEl(null);
  }, [selectedEl, getDoc]);

  const replaceImage = useCallback(
    async (file) => {
      if (!selectedEl || selectedEl.tagName !== "IMG" || !file) return;
      const dataUrl = await readFileAsDataUrl(file);
      selectedEl.setAttribute("src", dataUrl);
      selectedEl.removeAttribute("srcset");
      refresh();
    },
    [selectedEl, refresh]
  );

  const handleSave = useCallback(async () => {
    const doc = getDoc();
    if (!doc) return;
    setSaving(true);
    setSaveError(null);
    try {
      const html = serializeDoc(doc);
      const updated = await updateCatalogHtml(catalog.id, html);
      setSavedAt(Date.now());
      onSaved?.(updated);
    } catch (err) {
      setSaveError(toErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }, [getDoc, catalog.id, onSaved]);

  const handleDownloadHtml = useCallback(() => {
    const doc = getDoc();
    if (!doc) return;
    downloadString(serializeDoc(doc), `catalog-${catalog.id}.html`);
  }, [getDoc, catalog.id]);

  const openLibrary = useCallback(() => {
    const doc = getDoc();
    const docTitle = doc?.title?.trim();
    setTitle(catalog.title || docTitle || "Untitled catalog");
    setLibError(null);
    setLibOpen(true);
  }, [getDoc, catalog.title]);

  const handleSaveToLibrary = useCallback(async () => {
    const doc = getDoc();
    if (!doc) return;
    setLibSaving(true);
    setLibError(null);
    try {
      const html = serializeDoc(doc);
      const updated = await saveCatalog(catalog.id, {
        title: title.trim() || "Untitled catalog",
        html,
      });
      setSavedAt(Date.now());
      setLibrarySaved(true);
      setLibOpen(false);
      onSaved?.(updated);
    } catch (err) {
      setLibError(toErrorMessage(err));
    } finally {
      setLibSaving(false);
    }
  }, [getDoc, catalog.id, title, onSaved]);

  return (
    <div>
      <Bar $editing={editing}>
        <div className="left">
          <h1>
            <FiCheckCircle color="#15a06a" /> Your catalog
          </h1>
          <ModeToggle>
            <button
              type="button"
              data-active={editing}
              onClick={() => setEditing(true)}
            >
              <FiEdit3 size={15} /> Edit
            </button>
            <button
              type="button"
              data-active={!editing}
              onClick={() => setEditing(false)}
            >
              <FiEye size={15} /> Preview
            </button>
          </ModeToggle>
        </div>

        <div className="actions">
          {librarySaved && !libSaving && (
            <SaveNote>
              <FiCheckCircle size={15} /> Saved to library —{" "}
              <Link to="/saved">View library</Link>
            </SaveNote>
          )}
          {savedAt && !librarySaved && !saving && (
            <SaveNote>
              <FiCheckCircle size={15} /> Edits saved
            </SaveNote>
          )}
          <Button variant="ghost" size="sm" onClick={handleDownloadHtml}>
            <FiDownload size={15} /> HTML
          </Button>
          <Button
            href={`${catalogPdfUrl(catalog.id)}?t=${savedAt || 0}`}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            size="sm"
          >
            PDF <FiExternalLink size={14} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner size={16} /> Saving…
              </>
            ) : (
              <>
                <FiSave size={15} /> Save edits
              </>
            )}
          </Button>
          <SaveWrap>
            <Button size="sm" onClick={openLibrary} disabled={libSaving}>
              <FiBookmark size={15} /> Save to Library
            </Button>
            {libOpen && (
              <LibPopover>
                <div className="head">
                  <strong>Save to your library</strong>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setLibOpen(false)}
                  >
                    <FiX size={16} />
                  </button>
                </div>
                <label htmlFor="cat-lib-title">Catalog name</label>
                <input
                  id="cat-lib-title"
                  type="text"
                  value={title}
                  maxLength={200}
                  placeholder="Untitled catalog"
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !libSaving) handleSaveToLibrary();
                  }}
                  autoFocus
                />
                {libError && <div className="err">Couldn’t save: {libError}</div>}
                <Button
                  block
                  size="sm"
                  onClick={handleSaveToLibrary}
                  disabled={libSaving}
                >
                  {libSaving ? (
                    <>
                      <Spinner size={16} $inverse /> Saving…
                    </>
                  ) : (
                    <>
                      <FiBookmark size={15} /> Save to Library
                    </>
                  )}
                </Button>
              </LibPopover>
            )}
          </SaveWrap>
        </div>
      </Bar>

      {editing && (
        <>
          <Hint>
            <FiEdit3 size={14} />
            Click any text to edit it. Click an image or section to style,
            replace, or remove it.
          </Hint>
          <EditorToolbar
            exec={exec}
            setFontSize={setSelectionFontSize}
            setFont={setSelectionFont}
            disabled={!editing}
          />
        </>
      )}

      {saveError && (
        <div style={{ color: "#e11d48", fontSize: 14, margin: "10px 0" }}>
          Couldn’t save: {saveError}
        </div>
      )}

      <Workspace $editing={editing}>
        <Stage ref={stageRef}>
          <ScaleWrap
            style={{
              width: pageW * scale,
              height: pageH * scale,
            }}
          >
            <PaperFrame
              ref={iframeRef}
              title="Catalog editor"
              srcDoc={initialHtmlRef.current}
              onLoad={handleIframeLoad}
              data-editing="true"
              style={{
                width: pageW,
                height: pageH,
                transform: `scale(${scale})`,
              }}
            />
          </ScaleWrap>
        </Stage>

        {editing && (
          <ElementPanel
            element={selectedEl}
            onStyle={updateElementStyle}
            onSelectParent={selectParent}
            onDelete={deleteElement}
            onDeleteSection={deleteSection}
            onReplaceImage={replaceImage}
          />
        )}
      </Workspace>
    </div>
  );
}

export default CatalogEditor;
