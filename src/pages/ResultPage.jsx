import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FiPlus, FiAlertTriangle } from "react-icons/fi";
import { useState } from "react";
import { Container } from "../components/ui/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { StatusTimeline } from "../components/catalog/StatusTimeline";
import { CatalogEditor } from "../components/editor/CatalogEditor";
import { useCatalogJob } from "../hooks/useCatalogJob";

const Wrap = styled(Container)`
  padding: 40px 0 64px;
`;

const ProgressLayout = styled.div`
  max-width: 560px;
  margin: 24px auto 0;
`;

const ProgressCard = styled(Card)`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h1 {
    font-size: 26px;
  }
  .sub {
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 18px;
  }
`;

const ErrorCard = styled(Card)`
  max-width: 560px;
  margin: 24px auto 0;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;

  .icon {
    color: ${({ theme }) => theme.colors.danger};
  }
  pre {
    width: 100%;
    background: ${({ theme }) => theme.colors.surfaceAlt};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: 14px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-word;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const STATUS_COPY = {
  queued: "Your job is queued and will start in a moment.",
  extracting: "Reading and extracting your content…",
  refining: "The AI is structuring and refining your copy…",
  rendering: "Composing the page layout…",
  exporting: "Generating the print-ready PDF…",
};

export function ResultPage() {
  const { id } = useParams();
  const { catalog: polled, error, loading } = useCatalogJob(id);
  const [localCatalog, setLocalCatalog] = useState(null);
  const catalog = localCatalog || polled;

  if (error && !catalog) {
    return (
      <Wrap>
        <ErrorCard>
          <FiAlertTriangle className="icon" size={30} />
          <h2>Couldn’t load this catalog</h2>
          <p style={{ color: "#6a6680" }}>{error}</p>
          <Button to="/create" variant="secondary">
            <FiPlus size={16} /> Start a new one
          </Button>
        </ErrorCard>
      </Wrap>
    );
  }

  const status = catalog?.status;
  const isDone = status === "done";
  const isFailed = status === "failed";

  if (!isDone && !isFailed) {
    return (
      <Wrap>
        <ProgressLayout>
          <ProgressCard>
            <Badge tone="brand" style={{ alignSelf: "flex-start" }}>
              {loading && !catalog ? "Connecting…" : "In progress"}
            </Badge>
            <h1>Building your catalog</h1>
            <p className="sub">
              {STATUS_COPY[status] ||
                "Hang tight — this usually takes 30–60 seconds."}
            </p>
            <StatusTimeline status={status || "queued"} />
          </ProgressCard>
        </ProgressLayout>
      </Wrap>
    );
  }

  // ---- Failed ----
  if (isFailed) {
    return (
      <Wrap>
        <ErrorCard>
          <FiAlertTriangle className="icon" size={30} />
          <h2>Generation failed</h2>
          <p style={{ color: "#6a6680" }}>
            The job stopped before finishing. The error from the pipeline:
          </p>
          <pre>{catalog.error || "No error detail was returned."}</pre>
          <div style={{ display: "flex", gap: 10 }}>
            <Button to="/create">
              <FiPlus size={16} /> Try again
            </Button>
          </div>
        </ErrorCard>
      </Wrap>
    );
  }

  // ---- Done: edit, then export the catalog ----
  return (
    <Wrap>
      <CatalogEditor catalog={catalog} onSaved={setLocalCatalog} />
    </Wrap>
  );
}

export default ResultPage;
