import styled from "styled-components";
import {
  FiArrowRight,
  FiUploadCloud,
  FiCpu,
  FiLayout,
  FiDownload,
  FiEdit3,
  FiZap,
} from "react-icons/fi";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const Hero = styled.section`
  position: relative;
  // background: ${({ theme }) => theme.gradients.inkGlow};
  color: ${({ theme }) => theme.colors.textInverse};
  overflow: hidden;
  padding: 96px 0 110px;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
`;

const HeroInner = styled(Container)`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 860px;

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.16);
    font-size: 13.5px;
    color: ${({ theme }) => theme.colors.textInverseMuted};
    margin-bottom: 26px;
  }

  h1 {
    font-size: clamp(38px, 6.5vw, 68px);
    line-height: 1.04;
      background: ${({ theme }) => theme.gradients.brand};
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .grad {
    background: ${({ theme }) => theme.gradients.brand};
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  p.lead {
    margin: 24px auto 0;
    max-width: 620px;
    font-size: clamp(16px, 2vw, 19px);
    line-height: 1.6;
    color: black;
    // color: ${({ theme }) => theme.colors.textInverseMuted};
  }
  .cta {
    margin-top: 38px;
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 460px) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled(Card)`
  padding: 26px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .icon {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    display: grid;
    place-items: center;
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primaryDark};
  }
  .num {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: ${({ theme }) => theme.colors.textFaint};
  }
  h3 {
    font-size: 17px;
  }
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.55;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(Card)`
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  .icon {
    color: ${({ theme }) => theme.colors.accent};
  }
  h3 {
    font-size: 18px;
  }
  p {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14.5px;
    line-height: 1.6;
  }
`;

const CtaBand = styled.div`
  background: ${({ theme }) => theme.gradients.brand};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 56px 40px;
  text-align: center;
  color: #fff;
  box-shadow: ${({ theme }) => theme.shadows.glow};

  h2 {
    color: #fff;
    font-size: clamp(26px, 4vw, 36px);
  }
  p {
    margin: 14px auto 28px;
    max-width: 520px;
    opacity: 0.92;
    font-size: 17px;
  }
`;

const STEPS = [
  {
    icon: <FiUploadCloud size={22} />,
    title: "Drop in your content",
    body: "Paste raw notes or product details — no formatting required.",
  },
  {
    icon: <FiCpu size={22} />,
    title: "AI structures it",
    body: "The model refines copy into a clean, marketing-ready catalog schema.",
  },
  {
    icon: <FiLayout size={22} />,
    title: "Pick a template",
    body: "Choose a polished layout or let AI design one from scratch.",
  },
  {
    icon: <FiDownload size={22} />,
    title: "Render & export",
    body: "Preview the page live, then export a print-ready PDF.",
  },
];

const FEATURES = [
  {
    icon: <FiZap size={24} />,
    title: "From notes to layout in seconds",
    body: "Skip the design back-and-forth. A single page, composed and styled automatically.",
  },
  {
    icon: <FiEdit3 size={24} />,
    title: "Fully editable output",
    body: "Every text node is editable in the rendered HTML — tweak copy without touching code.",
  },
  {
    icon: <FiLayout size={24} />,
    title: "Templates or AI freestyle",
    body: "Use a curated fixed layout, or hand the whole design to the model for something bespoke.",
  },
];

export function LandingPage() {
  return (
    <>
      <Hero>
        <HeroInner>
          <span className="pill">
            <FiZap size={14} /> AI-powered catalog builder
          </span>
          <h1>
            Raw notes in.
            <br />
            <span className="grad">Polished catalog out.</span>
          </h1>
          <p className="lead">
            Cataloge turns a messy paragraph of product details into a clean,
            editable one-page brochure — designed, written, and export-ready.
          </p>
          <div className="cta">
            <Button to="/create" size="lg">
              Create a catalog <FiArrowRight size={18} />
            </Button>
            <Button to="/templates" size="lg" variant="inverse">
              Browse templates
            </Button>
          </div>
        </HeroInner>
      </Hero>

      <Section
        eyebrow="How it works"
        title="Four steps, one page"
        subtitle="No design skills needed. Bring the content — Cataloge handles structure, styling, and export."
      >
        <Steps>
          {STEPS.map((s, i) => (
            <StepCard key={s.title}>
              <span className="icon">{s.icon}</span>
              <span className="num">STEP {i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </StepCard>
          ))}
        </Steps>
      </Section>

      <Section
        eyebrow="Why Cataloge"
        title="Built for speed and polish"
        tight
      >
        <Features>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title}>
              <span className="icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </FeatureCard>
          ))}
        </Features>
      </Section>

      <Container>
        <CtaBand>
          <Badge tone="neutral" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>
            Ready in under a minute
          </Badge>
          <h2 style={{ marginTop: 16 }}>Build your first catalog now</h2>
          <p>
            Paste your product details, choose a look, and watch a finished page
            render in front of you.
          </p>
          <Button to="/create" size="lg" variant="inverse">
            Get started <FiArrowRight size={18} />
          </Button>
        </CtaBand>
      </Container>
    </>
  );
}

export default LandingPage;
