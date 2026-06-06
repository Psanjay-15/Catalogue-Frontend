import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiArrowUpRight, FiImage } from "react-icons/fi";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const A4_W = 794;
const A4_H = 1123;

const Wrap = styled(Card)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Thumb = styled.div`
  position: relative;
  aspect-ratio: ${A4_W} / ${A4_H};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  overflow: hidden;
  display: grid;
  place-items: center;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: ${A4_W}px;
    height: ${A4_H}px;
    border: 0;
    transform-origin: top left;
    pointer-events: none; /* clicks fall through to the card */
  }
  .fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 13px;
  }
`;

const Body = styled.div`
  padding: 18px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  h3 {
    font-size: 18px;
  }
  p {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    line-height: 1.55;
    flex: 1;
  }
  .actions {
    display: flex;
    gap: 10px;
    margin-top: 6px;
  }
`;

export function TemplateCard({ template }) {
  const navigate = useNavigate();
  const isAi = template.kind?.toLowerCase().includes("ai");

  const thumbRef = useRef(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = thumbRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / A4_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Wrap $interactive onClick={() => navigate(`/templates/${template.id}`)}>
      <Thumb ref={thumbRef}>
        {template.sampleHtml ? (
          <iframe
            title={`${template.name} preview`}
            srcDoc={template.sampleHtml}
            loading="lazy"
            scrolling="no"
            tabIndex={-1}
            sandbox="allow-same-origin"
            style={{ transform: `scale(${scale})` }}
          />
        ) : (
          <span className="fallback">
            <FiImage size={26} />
            No preview
          </span>
        )}
      </Thumb>

      <Body>
        <div className="top">
          <h3>{template.name}</h3>
          <Badge tone={isAi ? "accent" : "brand"}>
            {isAi ? "AI freestyle" : "Fixed layout"}
          </Badge>
        </div>
        <p>{template.description}</p>
        <div className="actions" onClick={(e) => e.stopPropagation()}>
          <Button
            to={`/templates/${template.id}`}
            variant="secondary"
            size="sm"
          >
            Preview
          </Button>
          <Button to={`/create?template=${template.id}`} size="sm">
            Use this <FiArrowUpRight size={15} />
          </Button>
        </div>
      </Body>
    </Wrap>
  );
}

export default TemplateCard;
