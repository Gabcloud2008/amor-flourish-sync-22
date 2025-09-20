import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import AuthPage from "@/components/AuthPage";
import HomePage from "@/pages/HomePage";
import FeedPage from "@/pages/FeedPage";
import QuotesPage from "@/pages/QuotesPage";
import PlaylistsPage from "@/pages/PlaylistsPage";
import ProfilePage from "@/pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/app" element={<HomePage />} />
              <Route path="/app/feed" element={<FeedPage />} />
              <Route path="/app/quotes" element={<QuotesPage />} />
              <Route path="/app/playlists" element={<PlaylistsPage />} />
              <Route path="/app/profile" element={<ProfilePage />} />
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
