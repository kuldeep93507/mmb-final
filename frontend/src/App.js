import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";

// Layout Components
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import WhatsAppButton from "./components/Common/WhatsAppButton";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Admin Components
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminServices from "./pages/Admin/AdminServices";
import AdminProjects from "./pages/Admin/AdminProjects";
import AdminContacts from "./pages/Admin/AdminContacts";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminBlogs from "./pages/Admin/AdminBlogs";
import AdminTestimonials from "./pages/Admin/AdminTestimonials";
import AdminMedia from "./pages/Admin/AdminMedia";
import AdminOffers from "./pages/Admin/AdminOffers";
import AdminAppearance from "./pages/Admin/AdminAppearance";
import AdminHeroSection from "./pages/Admin/AdminHeroSection";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/admin/dashboard" />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <SiteSettingsProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Home />
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            } />
            
            <Route path="/about" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <About />
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            } />
            
            <Route path="/services" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Services />
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            } />
            
            <Route path="/portfolio" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Portfolio />
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            } />
            
            <Route path="/testimonials" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Testimonials />
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            } />
            
            <Route path="/blog" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Blog />
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            } />
            
            <Route path="/contact" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Contact />
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            } />
            
            <Route path="/privacy" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <PrivacyPolicy />
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            } />
            
            <Route path="/terms" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <TermsOfService />
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="hero-section" element={<AdminHeroSection />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="appearance" element={<AdminAppearance />} />
            </Route>

            {/* Redirect /admin to /admin/dashboard */}
            <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
          <Toaster />
            </SiteSettingsProvider>
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
