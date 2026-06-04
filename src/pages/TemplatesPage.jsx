import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { Card } from "../components/ui/Card";
import { TemplateCard } from "../components/catalog/TemplateCard";
import { listTemplates, toErrorMessage } from "../services";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorCard = styled(Card)`
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  max-width: 480px;
  margin: 40px auto;

  .icon {
    color: ${({ theme }) => theme.colors.danger};
  }
  p {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  code {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 13px;
    background: ${({ theme }) => theme.colors.surfaceAlt};
    padding: 2px 6px;
    border-radius: 6px;
  }
`;

export function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setTemplates(await listTemplates());
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Section
      eyebrow="Template gallery"
      title="Start from a polished layout"
      subtitle="Preview any template full-size, then jump straight into the builder with it selected. Or choose AI freestyle to design from scratch."
    >
      {loading && (
        <Center>
          <Spinner size={32} />
          <span>Loading templates…</span>
        </Center>
      )}

      {!loading && error && (
        <ErrorCard>
          <FiAlertCircle className="icon" size={32} />
          <h3>Couldn’t load templates</h3>
          <p>{error}</p>
          <p>
            Make sure the API is running at{" "}
            <code>http://localhost:8000</code>.
          </p>
          <Button variant="secondary" onClick={load}>
            <FiRefreshCw size={16} /> Retry
          </Button>
        </ErrorCard>
      )}

      {!loading && !error && templates.length === 0 && (
        <Center>
          <p>No templates found. Seed them on the backend first.</p>
        </Center>
      )}

      {!loading && !error && templates.length > 0 && (
        <Grid>
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </Grid>
      )}
    </Section>
  );
}

export default TemplatesPage;
