import styled from "styled-components";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiRotateCcw,
  FiRotateCw,
  FiType,
  FiDroplet,
  FiPlusSquare,
} from "react-icons/fi";
import { FONT_OPTIONS, FONT_SIZE_OPTIONS } from "../../utils/editor";



const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  margin-bottom: 16px;
  position: sticky;
  top: calc(${({ theme }) => theme.layout.navHeight} + 8px);
  z-index: 20;
`;

const Divider = styled.span`
  width: 1px;
  align-self: stretch;
  background: ${({ theme }) => theme.colors.border};
  margin: 2px 4px;
`;

const IconBtn = styled.button.attrs({ type: "button" })`
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    border-color: ${({ theme }) => theme.colors.border};
  }
`;

const Sel = styled.select`
  height: 34px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: 0 8px;
  font-size: 13.5px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
`;

const ColorBtn = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};

  input[type="color"] {
    width: 22px;
    height: 22px;
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
  }
`;

const AddBtn = styled.button.attrs({ type: "button" })`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

export function EditorToolbar({ exec, setFontSize, setFont, onAddSection }) {
  const keep = (e) => e.preventDefault();

  return (
    <Bar onMouseDown={keep}>
      <AddBtn title="Add a new section to the page" onClick={onAddSection}>
        <FiPlusSquare size={15} /> Add section
      </AddBtn>

      <Divider />

      <IconBtn title="Undo" onClick={() => exec("undo")}>
        <FiRotateCcw size={16} />
      </IconBtn>
      <IconBtn title="Redo" onClick={() => exec("redo")}>
        <FiRotateCw size={16} />
      </IconBtn>

      <Divider />

      <IconBtn title="Bold" onClick={() => exec("bold")}>
        <FiBold size={16} />
      </IconBtn>
      <IconBtn title="Italic" onClick={() => exec("italic")}>
        <FiItalic size={16} />
      </IconBtn>
      <IconBtn title="Underline" onClick={() => exec("underline")}>
        <FiUnderline size={16} />
      </IconBtn>
      <IconBtn
        title="Strikethrough"
        onClick={() => exec("strikeThrough")}
        style={{ textDecoration: "line-through", fontWeight: 700 }}
      >
        S
      </IconBtn>

      <Divider />

      <Sel
        title="Font"
        defaultValue=""
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => setFont(e.target.value)}
      >
        {FONT_OPTIONS.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </Sel>

      <Sel
        title="Font size"
        defaultValue=""
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => e.target.value && setFontSize(Number(e.target.value))}
      >
        <option value="">
          Size
        </option>
        {FONT_SIZE_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}px
          </option>
        ))}
      </Sel>

      <Divider />

      <ColorBtn title="Text color">
        <FiType size={15} />
        <input
          type="color"
          onChange={(e) => exec("foreColor", e.target.value)}
        />
      </ColorBtn>
      <ColorBtn title="Highlight color">
        <FiDroplet size={15} />
        <input
          type="color"
          onChange={(e) => exec("hiliteColor", e.target.value)}
        />
      </ColorBtn>

      <Divider />

      <IconBtn title="Align left" onClick={() => exec("justifyLeft")}>
        <FiAlignLeft size={16} />
      </IconBtn>
      <IconBtn title="Align center" onClick={() => exec("justifyCenter")}>
        <FiAlignCenter size={16} />
      </IconBtn>
      <IconBtn title="Align right" onClick={() => exec("justifyRight")}>
        <FiAlignRight size={16} />
      </IconBtn>
    </Bar>
  );
}

export default EditorToolbar;
