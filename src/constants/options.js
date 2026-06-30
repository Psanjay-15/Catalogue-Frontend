

export const STYLE_OPTIONS = [
  { value: "modern", label: "Modern", hint: "Fresh & confident" },
  { value: "luxury", label: "Luxury", hint: "Refined & evocative" },
  { value: "minimal", label: "Minimal", hint: "Spare & precise" },
  { value: "corporate", label: "Corporate", hint: "Sober & authoritative" },
  { value: "creative", label: "Creative", hint: "Playful & vivid" },
];

export const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const PROVIDER_OPTIONS = [
  { value: "gemini", label: "Gemini", hint: "Google - cloud" },
  { value: "ollama", label: "Ollama", hint: "Local - free" },
  { value: "openai", label: "OpenAI", hint: "Cloud" },
  { value: "anthropic", label: "Claude", hint: "Cloud" },
];

export const JOB_STEPS = [
  { key: "queued", label: "Queued" },
  { key: "extracting", label: "Extracting" },
  { key: "refining", label: "Refining with AI" },
  { key: "rendering", label: "Rendering" },
  { key: "exporting", label: "Exporting" },
  { key: "done", label: "Done" },
];

export const TERMINAL_STATUSES = ["done", "failed"];
