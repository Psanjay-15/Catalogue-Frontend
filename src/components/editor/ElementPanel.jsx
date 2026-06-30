import { useRef } from "react";
import styled from "styled-components";
import {
  FiTrash2,
  FiCornerLeftUp,
  FiImage,
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiUpload,
  FiLayers,
  FiArrowUp,
  FiArrowDown,
  FiCopy,
  FiPlus,
} from "react-icons/fi";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  rgbToHex,
  parsePx,
  describeElement,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
} from "../../utils/editor";


const Panel = styled(Card)`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: calc(${({ theme }) => theme.layout.navHeight} + 8px);

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: static;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .tag {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 12.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primaryDark};
    background: ${({ theme }) => theme.colors.primarySoft};
    padding: 3px 9px;
    border-radius: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 160px;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  > label {
    font-size: 12.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorField = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};

  input[type="color"] {
    width: 38px;
    height: 28px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    padding: 0;
    background: none;
    cursor: pointer;
  }
`;

const MiniSelect = styled.select`
  flex: 1;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: 0 8px;
  font-size: 13px;
  cursor: pointer;
`;

const Toggle = styled.button.attrs({ type: "button" })`
  flex: 1;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, $on }) => ($on ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $on }) =>
    $on ? theme.colors.primarySoft : theme.colors.surface};
  color: ${({ theme, $on }) =>
    $on ? theme.colors.primaryDark : theme.colors.text};
  cursor: pointer;
`;

const Range = styled.input`
  width: 100%;
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  padding: 26px 8px;
  color: ${({ theme }) => theme.colors.textFaint};

  p {
    font-size: 13.5px;
    line-height: 1.5;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Danger = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DangerBtn = styled.button.attrs({ type: "button" })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.dangerSoft};
  background: ${({ theme }) => theme.colors.dangerSoft};
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  &:hover {
    background: ${({ theme }) => theme.colors.danger};
    color: #fff;
  }
`;

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const OrderBtn = styled.button.attrs({ type: "button" })`
  display: grid;
  place-items: center;
  width: 30px;
  height: 28px;
  border-radius: 7px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const AddChip = styled.button.attrs({ type: "button" })`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.primarySoft};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export function ElementPanel({
  element,
  section,
  onStyle,
  onSectionStyle,
  onResetSection,
  onMoveSection,
  onSelectParent,
  onDelete,
  onDeleteSection,
  onReplaceImage,
  onDuplicate,
  onDuplicateSection,
  onAddBlock,
  onAddSection,
}) {
  const fileRef = useRef(null);

  if (!element) {
    return (
      <Panel>
        <Empty>
          <FiLayers size={26} />
          <p>
            Click any element to style, duplicate, or remove it - or add a new
            section below.
          </p>
          <Button size="sm" onClick={onAddSection}>
            <FiPlus size={14} /> Add a section
          </Button>
        </Empty>
      </Panel>
    );
  }

  const win = element.ownerDocument?.defaultView;
  const cs = win ? win.getComputedStyle(element) : {};
  const isImage = element.tagName === "IMG";

  const sectionCs = section && win ? win.getComputedStyle(section) : null;
  const sectionW = section ? parsePx(section.style.width || sectionCs?.width) : 0;
  const sectionH = section ? parsePx(section.style.height || sectionCs?.height) : 0;

  const fontWeight = parseInt(cs.fontWeight, 10) || 400;
  const isBold = fontWeight >= 600;
  const isItalic = cs.fontStyle === "italic";
  const isUnderline = (cs.textDecorationLine || cs.textDecoration || "").includes(
    "underline"
  );
  const align = cs.textAlign || "left";
  const currentWidth = parsePx(element.style.width || cs.width);

  return (
    <Panel>
      <Header>
        <span className="tag">{describeElement(element)}</span>
        <Button variant="ghost" size="sm" onClick={onSelectParent}>
          <FiCornerLeftUp size={14} /> Parent
        </Button>
      </Header>

      {isImage ? (
        <>
          <Group>
            <label>Image</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onReplaceImage(f);
                e.target.value = "";
              }}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              <FiUpload size={14} /> Replace from device
            </Button>
          </Group>

          <Group>
            <label>Width - {currentWidth}px</label>
            <Range
              type="range"
              min={40}
              max={1000}
              step={10}
              value={Math.min(1000, currentWidth)}
              onChange={(e) => {
                onStyle("width", `${e.target.value}px`);
                onStyle("height", "auto");
              }}
            />
            <Row>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onStyle("width", "100%");
                  onStyle("height", "auto");
                }}
              >
                Fit width
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onStyle("width", "");
                  onStyle("height", "");
                }}
              >
                Reset
              </Button>
            </Row>
          </Group>
        </>
      ) : (
        <>
          <Group>
            <ColorField>
              Text color
              <input
                type="color"
                value={rgbToHex(cs.color)}
                onChange={(e) => onStyle("color", e.target.value)}
              />
            </ColorField>
            <ColorField>
              Background
              <input
                type="color"
                value={rgbToHex(cs.backgroundColor)}
                onChange={(e) => onStyle("background-color", e.target.value)}
              />
            </ColorField>
          </Group>

          <Group>
            <label>Font</label>
            <MiniSelect
              value=""
              onChange={(e) => onStyle("font-family", e.target.value)}
            >
              <option value="">Change font…</option>
              {FONT_OPTIONS.filter((f) => f.value).map((f) => (
                <option key={f.label} value={f.value}>
                  {f.label}
                </option>
              ))}
            </MiniSelect>
          </Group>

          <Group>
            <label>Font size - {parsePx(cs.fontSize)}px</label>
            <MiniSelect
              value={parsePx(cs.fontSize)}
              onChange={(e) => onStyle("font-size", `${e.target.value}px`)}
            >
              {FONT_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}px
                </option>
              ))}
            </MiniSelect>
          </Group>

          <Group>
            <label>Style</label>
            <Row>
              <Toggle
                $on={isBold}
                onClick={() =>
                  onStyle("font-weight", isBold ? "normal" : "700")
                }
              >
                <FiBold size={15} />
              </Toggle>
              <Toggle
                $on={isItalic}
                onClick={() =>
                  onStyle("font-style", isItalic ? "normal" : "italic")
                }
              >
                <FiItalic size={15} />
              </Toggle>
              <Toggle
                $on={isUnderline}
                onClick={() =>
                  onStyle("text-decoration", isUnderline ? "none" : "underline")
                }
              >
                <FiUnderline size={15} />
              </Toggle>
            </Row>
          </Group>

          <Group>
            <label>Align</label>
            <Row>
              <Toggle
                $on={align === "left" || align === "start"}
                onClick={() => onStyle("text-align", "left")}
              >
                <FiAlignLeft size={15} />
              </Toggle>
              <Toggle
                $on={align === "center"}
                onClick={() => onStyle("text-align", "center")}
              >
                <FiAlignCenter size={15} />
              </Toggle>
              <Toggle
                $on={align === "right" || align === "end"}
                onClick={() => onStyle("text-align", "right")}
              >
                <FiAlignRight size={15} />
              </Toggle>
            </Row>
          </Group>
        </>
      )}

      <Divider />

      <Group>
        <label>Add &amp; duplicate</label>
        <Row>
          <Button variant="secondary" size="sm" onClick={onDuplicate}>
            <FiCopy size={14} /> Duplicate
          </Button>
          <Button variant="ghost" size="sm" onClick={onDuplicateSection}>
            <FiLayers size={14} /> Section
          </Button>
        </Row>
        <ChipRow>
          <AddChip onClick={() => onAddBlock("heading")}>
            <FiPlus size={12} /> Heading
          </AddChip>
          <AddChip onClick={() => onAddBlock("text")}>
            <FiPlus size={12} /> Text
          </AddChip>
          <AddChip onClick={() => onAddBlock("image")}>
            <FiPlus size={12} /> Image
          </AddChip>
          <AddChip onClick={() => onAddBlock("button")}>
            <FiPlus size={12} /> Button
          </AddChip>
        </ChipRow>
      </Group>

      {section && (
        <>
          <Divider />

          <SectionHead>
            <span>Section</span>
            <Row style={{ flex: "none", gap: 6 }}>
              <OrderBtn title="Move section up" onClick={() => onMoveSection(-1)}>
                <FiArrowUp size={14} />
              </OrderBtn>
              <OrderBtn
                title="Move section down"
                onClick={() => onMoveSection(1)}
              >
                <FiArrowDown size={14} />
              </OrderBtn>
            </Row>
          </SectionHead>

          <Group>
            <ColorField>
              Section background
              <input
                type="color"
                value={rgbToHex(sectionCs?.backgroundColor)}
                onChange={(e) =>
                  onSectionStyle("background-color", e.target.value)
                }
              />
            </ColorField>
          </Group>

          <Group>
            <label>Width - {sectionW}px</label>
            <Range
              type="range"
              min={120}
              max={1600}
              step={5}
              value={Math.min(1600, sectionW)}
              onChange={(e) => onSectionStyle("width", `${e.target.value}px`)}
            />
          </Group>

          <Group>
            <label>Height - {sectionH}px</label>
            <Range
              type="range"
              min={40}
              max={2400}
              step={5}
              value={Math.min(2400, sectionH)}
              onChange={(e) => onSectionStyle("height", `${e.target.value}px`)}
            />
          </Group>

          <Row>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSectionStyle("width", "100%")}
            >
              Full width
            </Button>
            <Button variant="ghost" size="sm" onClick={onResetSection}>
              Reset size
            </Button>
          </Row>
        </>
      )}

      <Divider />

      <Danger>
        <DangerBtn onClick={onDelete}>
          <FiTrash2 size={15} />
          {isImage ? "Remove image" : "Delete element"}
        </DangerBtn>
        <DangerBtn onClick={onDeleteSection}>
          <FiImage size={15} style={{ display: "none" }} />
          <FiLayers size={15} />
          Remove whole section
        </DangerBtn>
      </Danger>
    </Panel>
  );
}

export default ElementPanel;
