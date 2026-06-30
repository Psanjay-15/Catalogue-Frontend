import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  FiSend,
  FiZap,
  FiAlertCircle,
  FiFileText,
  FiSettings,
  FiUpload,
} from "react-icons/fi";
import { Container } from "../components/ui/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import {
  Field,
  FieldLabel,
  Textarea,
  Select,
} from "../components/ui/Field";
import { OptionPills } from "../components/ui/OptionPills";
import {
  STYLE_OPTIONS,
  THEME_OPTIONS,
  PROVIDER_OPTIONS,
} from "../constants/options";
import {
  createCatalog,
  extractTextFromFile,
  listTemplates,
  toErrorMessage,
} from "../services";

const SAMPLE_TEXT = `Aurora Coffee Roasters - a small-batch specialty coffee roaster founded in 2016 in Portland, Oregon.

We source single-origin beans directly from farmers in Ethiopia, Colombia, and Guatemala, paying above fair-trade prices. Everything is roasted in small batches and shipped within 48 hours.

Products:
- Sunrise Blend - bright, citrusy light roast. $18/12oz bag.
- Midnight Espresso - rich dark roast with chocolate notes. $20/12oz.
- Decaf Reserve - Swiss water process, full flavor. $19/12oz.

We've served 12,000+ customers, with a 94% repeat rate. Carbon-neutral shipping since 2021.

Contact: hello@auroracoffee.co, +1 503-555-0188, auroracoffee.co, 88 Roast Ave, Portland OR.`;

const Hero = styled.div`
  padding: 40px 0 8px;
  text-align: center;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.primary};
  }
  h1 {
    margin-top: 12px;
    font-size: clamp(28px, 4.5vw, 42px);
  }
  p {
    margin: 14px auto 0;
    max-width: 560px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 17px;
  }
`;

const Layout = styled.form`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  padding: 32px 0 64px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled(Card)`
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PanelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 600;
  font-size: 17px;

  .icon {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Sticky = styled.div`
  position: sticky;
  top: calc(${({ theme }) => theme.layout.navHeight} + 16px);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ErrorBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dangerSoft};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const CharCount = styled.span`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textFaint};
`;

export function CreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetTemplate = searchParams.get("template");

  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    source_text: "",
    template_name: presetTemplate || "ai",
    style: "modern",
    theme: "light",
    llm_provider: "gemini",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedName, setUploadedName] = useState(null);

  useEffect(() => {
    listTemplates()
      .then(setTemplates)
      .catch(() => setTemplates([])); // form still works with the "ai" default
  }, []);

  // If the URL preset references a template that loaded, keep it selected.
  useEffect(() => {
    if (presetTemplate) {
      setForm((f) => ({ ...f, template_name: presetTemplate }));
    }
  }, [presetTemplate]);

  const templateChoices = useMemo(() => {
    const choices = [{ value: "ai", label: "AI freestyle (design from scratch)" }];
    templates
      .filter((t) => t.id !== "ai")
      .forEach((t) => choices.push({ value: t.id, label: t.name }));
    return choices;
  }, [templates]);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { text, filename, chars } = await extractTextFromFile(file);
      set("source_text", text);
      setUploadedName(`${filename} · ${chars.toLocaleString()} characters`);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.source_text.trim()) {
      setError("Please paste some content to build the catalog from.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createCatalog({
        ...form,
        source_text: form.source_text.trim(),
      });
      navigate(`/catalog/${res.id}`);
    } catch (err) {
      setError(toErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <Container>
      <Hero>
        <span className="eyebrow">
          <FiZap size={14} /> Catalog builder
        </span>
        <h1>Describe it. We’ll design it.</h1>
        <p>
          Paste your brand and product details below, choose a look, and
          generate a finished one-page catalog.
        </p>
      </Hero>

      <Layout onSubmit={handleSubmit}>
        {/* ---- Content ---- */}
        <Panel>
          <PanelTitle>
            <FiFileText className="icon" size={19} /> Your content
          </PanelTitle>

          <Field
            label={
              <TextHeader style={{ width: "100%" }}>
                <span>Brand &amp; product details</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    hidden
                    onChange={handleFile}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                  >
                    {uploading ? (
                      <>
                        <Spinner size={14} /> Reading…
                      </>
                    ) : (
                      <>
                        <FiUpload size={14} /> Upload PDF / DOCX / TXT
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      set("source_text", SAMPLE_TEXT);
                      setUploadedName(null);
                    }}
                  >
                    Try sample text
                  </Button>
                </div>
              </TextHeader>
            }
          >
            <Textarea
              placeholder="Paste anything - or upload a PDF/DOCX/TXT above. A company description, a product list, raw notes. The more detail you give, the richer the catalog. No formatting needed."
              value={form.source_text}
              onChange={(e) => {
                set("source_text", e.target.value);
                if (uploadedName) setUploadedName(null);
              }}
              style={{ minHeight: 320 }}
            />
          </Field>
          <CharCount>
            {form.source_text.length} characters
            {uploadedName ? ` · imported from ${uploadedName}` : ""}
          </CharCount>

          {error && (
            <ErrorBox>
              <FiAlertCircle size={18} />
              <span>{error}</span>
            </ErrorBox>
          )}
        </Panel>

        {/* ---- Settings ---- */}
        <Sticky>
          <Panel>
            <PanelTitle>
              <FiSettings className="icon" size={19} /> Design options
            </PanelTitle>

            <Field label="Template" htmlFor="template">
              <Select
                id="template"
                value={form.template_name}
                onChange={(e) => set("template_name", e.target.value)}
              >
                {templateChoices.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Field>

            <div>
              <FieldLabel style={{ marginBottom: 8 }}>Copy style</FieldLabel>
              <OptionPills
                name="style"
                options={STYLE_OPTIONS}
                value={form.style}
                onChange={(v) => set("style", v)}
              />
            </div>

            <div>
              <FieldLabel style={{ marginBottom: 8 }}>Theme</FieldLabel>
              <OptionPills
                name="theme"
                options={THEME_OPTIONS}
                value={form.theme}
                onChange={(v) => set("theme", v)}
              />
            </div>

            {/* <Divider /> */}

            {/* <div>
              <FieldLabel style={{ marginBottom: 8 }}>
                AI provider
              </FieldLabel>
              <OptionPills
                name="llm_provider"
                options={PROVIDER_OPTIONS}
                value={form.llm_provider}
                onChange={(v) => set("llm_provider", v)}
              />
            </div> */}
          </Panel>

          <Button type="submit" size="lg" block disabled={submitting}>
            {submitting ? (
              <>
                <Spinner size={18} $inverse /> Generating…
              </>
            ) : (
              <>
                Generate catalog <FiSend size={17} />
              </>
            )}
          </Button>
          <Badge tone="neutral" style={{ alignSelf: "center" }}>
            Generation takes ~30–60 seconds
          </Badge>
        </Sticky>
      </Layout>
    </Container>
  );
}

export default CreatePage;
