import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FiAlertCircle, FiRefreshCw, FiBookmark, FiArrowUpRight } from "react-icons/fi";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { Card } from "../components/ui/Card";
import { SavedCatalogCard } from "../components/catalog/SavedCatalogCard";
import { listSavedCatalogs, unsaveCatalog, toErrorMessage } from "../services";

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

const EmptyCard = styled(Card)`
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  max-width: 520px;
  margin: 24px auto;

  .icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }
  h3 {
    font-size: 20px;
  }
  p {
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.6;
  }
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

export function SavedCatalogsPage() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCatalogs(await listSavedCatalogs());
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = useCallback(async (id) => {
    setRemovingId(id);
    try {
      await unsaveCatalog(id);
      setCatalogs((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setRemovingId(null);
    }
  }, []);

  return (
    <Section
      eyebrow="Your library"
      title="Saved catalogs"
      subtitle="Everything you've kept. Open one to keep editing, download its PDF, or remove it from the library."
    >
      {loading && (
        <Center>
          <Spinner size={32} />
          <span>Loading your library…</span>
        </Center>
      )}

      {!loading && error && (
        <ErrorCard>
          <FiAlertCircle className="icon" size={32} />
          <h3>Couldn’t load your library</h3>
          <p>{error}</p>
          <p>
            Make sure the API is running at <code>http://localhost:8000</code>.
          </p>
          <Button variant="secondary" onClick={load}>
            <FiRefreshCw size={16} /> Retry
          </Button>
        </ErrorCard>
      )}

      {!loading && !error && catalogs.length === 0 && (
        <EmptyCard>
          <span className="icon">
            <FiBookmark size={26} />
          </span>
          <h3>No saved catalogs yet</h3>
          <p>
            Create a catalog, fine-tune it in the editor, then hit{" "}
            <strong>Save to Library</strong> to keep it here.
          </p>
          <Button to="/create">
            Create a catalog <FiArrowUpRight size={16} />
          </Button>
        </EmptyCard>
      )}

      {!loading && !error && catalogs.length > 0 && (
        <Grid>
          {catalogs.map((c) => (
            <SavedCatalogCard
              key={c.id}
              catalog={c}
              onRemove={handleRemove}
              removing={removingId === c.id}
            />
          ))}
        </Grid>
      )}
    </Section>
  );
}

export default SavedCatalogsPage;
