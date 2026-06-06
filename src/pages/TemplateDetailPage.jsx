import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft, FiArrowUpRight, FiExternalLink } from "react-icons/fi";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import { getTemplate, toErrorMessage } from "../services";

const Wrap = styled(Container)`
  padding-top: 32px;
  padding-bottom: 48px;
`;

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin: 18px 0 24px;

  .meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  h1 {
    font-size: clamp(24px, 4vw, 34px);
  }
  p {
    color: ${({ theme }) => theme.colors.textMuted};
    max-width: 560px;
  }
  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

const Frame = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: #fff;
  box-shadow: ${({ theme }) => theme.shadows.md};
  height: 78vh;
  min-height: 560px;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function TemplateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getTemplate(id)
      .then((t) => active && setTemplate(t))
      .catch((err) => active && setError(toErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const isAi = template?.kind?.toLowerCase().includes("ai");

  const openFullPage = () => {
    if (!template?.sampleHtml) return;
    const url = URL.createObjectURL(
      new Blob([template.sampleHtml], { type: "text/html" })
    );
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <Wrap>
      <Button variant="ghost" size="sm" onClick={() => navigate("/templates")}>
        <FiArrowLeft size={16} /> All templates
      </Button>

      {loading && (
        <Center>
          <Spinner size={30} />
          <span>Loading preview…</span>
        </Center>
      )}

      {!loading && error && (
        <Center>
          <h3>Template not found</h3>
          <p>{error}</p>
          <Button to="/templates" variant="secondary">
            Back to gallery
          </Button>
        </Center>
      )}

      {!loading && !error && template && (
        <>
          <Top>
            <div className="meta">
              <Badge tone={isAi ? "accent" : "brand"}>
                {isAi ? "AI freestyle" : "Fixed layout"}
              </Badge>
              <h1>{template.name}</h1>
              <p>{template.description}</p>
            </div>
            <div className="actions">
              <Button variant="secondary" onClick={openFullPage}>
                Open full page <FiExternalLink size={15} />
              </Button>
              <Button to={`/create?template=${template.id}`}>
                Use this template <FiArrowUpRight size={16} />
              </Button>
            </div>
          </Top>

          <Frame>
            <iframe
              title={`${template.name} sample`}
              srcDoc={template.sampleHtml}
              sandbox="allow-same-origin"
            />
          </Frame>
        </>
      )}
    </Wrap>
  );
}

export default TemplateDetailPage;
