import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { LandingPage } from "./pages/LandingPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { TemplateDetailPage } from "./pages/TemplateDetailPage";
import { CreatePage } from "./pages/CreatePage";
import { ResultPage } from "./pages/ResultPage";
import { SavedCatalogsPage } from "./pages/SavedCatalogsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/:id" element={<TemplateDetailPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/catalog/:id" element={<ResultPage />} />
        <Route path="/saved" element={<SavedCatalogsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
