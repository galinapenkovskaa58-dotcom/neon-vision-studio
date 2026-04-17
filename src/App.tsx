import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Neurophoto from "./pages/Neurophoto";
import AiVideo from "./pages/AiVideo";
import Songs from "./pages/Songs";
import VibeCoding from "./pages/VibeCoding";
import Privacy from "./pages/Privacy";
import Offer from "./pages/Offer";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ScrollToTopButton from "./components/ScrollToTopButton";
import HashScroll from "./components/HashScroll";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <HashScroll />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/neurophoto" element={<Neurophoto />} />
          <Route path="/ai-video" element={<AiVideo />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/vibe-coding" element={<VibeCoding />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTopButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
