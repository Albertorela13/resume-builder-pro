import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CVProvider } from "@/contexts/CVContext";
import JobDetailsPage from "./pages/JobDetailsPage";
import SummaryPage from "./pages/SummaryPage";
import ExperiencePage from "./pages/ExperiencePage";
import SkillsPage from "./pages/SkillsPage";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CVProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/job-details" replace />} />
            <Route path="/job-details" element={<JobDetailsPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CVProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
