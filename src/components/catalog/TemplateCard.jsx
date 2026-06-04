import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiArrowUpRight, FiImage } from "react-icons/fi";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const Wrap = styled(Card)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Thumb = styled.div`
  position: relative;
  aspect-ratio: 794 / 1123; /* A4 portrait — matches the preview PNG */
  background: ${({ theme }) => theme.colors.surfaceAlt};
  overflow: hidden;
  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
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

  return (
    <Wrap $interactive onClick={() => navigate(`/templates/${template.id}`)}>
      <Thumb>
        <img
          src={template.previewImageUrl}
          alt={`${template.name} preview`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling.style.display = "flex";
          }}
        />
        <span className="fallback" style={{ display: "none" }}>
          <FiImage size={26} />
          Preview not generated
        </span>
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
