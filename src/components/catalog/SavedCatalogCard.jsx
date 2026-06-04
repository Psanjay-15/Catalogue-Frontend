import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiArrowUpRight, FiTrash2, FiFileText } from "react-icons/fi";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { PAGE_PX } from "../../utils/editor";
import { catalogHtmlUrl, catalogPdfUrl } from "../../services";

const Wrap = styled(Card)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Thumb = styled.div`
  position: relative;
  aspect-ratio: ${({ $w, $h }) => `${$w} / ${$h}`};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  overflow: hidden;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  iframe {
    border: 0;
    background: #fff;
    transform-origin: top left;
    pointer-events: none;
  }

  .loading {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: ${({ theme }) => theme.colors.textFaint};
  }
`;

const Body = styled.div`
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;

  h3 {
    font-size: 17px;
    line-height: 1.35;
    /* keep long titles to two lines */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: -2px;
  }
  .chip {
    font-size: 11.5px;
    font-weight: 600;
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.surfaceAlt};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.pill};
    padding: 3px 10px;
  }
  .date {
    font-size: 12.5px;
    color: ${({ theme }) => theme.colors.textFaint};
    flex: 1;
  }
  .actions {
    display: flex;
    gap: 10px;
    margin-top: 6px;
  }
  .actions .grow {
    flex: 1;
  }
`;

const RemoveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 8px 12px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.dangerSoft};
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}


export function SavedCatalogCard({ catalog, onRemove, removing }) {
  const navigate = useNavigate();
  const thumbRef = useRef(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [pageW, pageH] = PAGE_PX[catalog.page_size] || PAGE_PX.A4;

  useLayoutEffect(() => {
    const el = thumbRef.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / pageW);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageW]);

  const open = () => navigate(`/catalog/${catalog.id}`);

  return (
    <Wrap>
      <Thumb ref={thumbRef} $w={pageW} $h={pageH} onClick={open}>
        {scale > 0 && (
          <iframe
            title={catalog.title || "Saved catalog"}
            src={catalogHtmlUrl(catalog.id)}
            loading="lazy"
            scrolling="no"
            onLoad={() => setLoaded(true)}
            style={{
              width: pageW,
              height: pageH,
              transform: `scale(${scale})`,
            }}
          />
        )}
        {!loaded && (
          <span className="loading">
            <Spinner size={26} />
          </span>
        )}
      </Thumb>

      <Body>
        <h3>{catalog.title || "Untitled catalog"}</h3>
        <div className="meta">
          {catalog.style && <span className="chip">{catalog.style}</span>}
          {catalog.theme && <span className="chip">{catalog.theme}</span>}
          {catalog.page_size && <span className="chip">{catalog.page_size}</span>}
        </div>
        <span className="date">Updated {formatDate(catalog.updated_at)}</span>
        <div className="actions">
          <Button className="grow" to={`/catalog/${catalog.id}`} size="sm">
            <FiArrowUpRight size={15} /> Open
          </Button>
          {catalog.pdf_url && (
            <Button
              href={catalogPdfUrl(catalog.id)}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
              size="sm"
            >
              <FiFileText size={15} /> PDF
            </Button>
          )}
          <RemoveBtn
            type="button"
            onClick={() => onRemove?.(catalog.id)}
            disabled={removing}
            aria-label="Remove from library"
          >
            {removing ? <Spinner size={15} /> : <FiTrash2 size={15} />}
          </RemoveBtn>
        </div>
      </Body>
    </Wrap>
  );
}

export default SavedCatalogCard;
