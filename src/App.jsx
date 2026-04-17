import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Audit from './pages/Audit';
import Legal from './pages/Legal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Audit page uses its own full-height layout (no footer scroll)
function AuditLayout() {
  return (
    <>
      <Navbar />
      <main className="audit-layout-main">
        <Audit />
      </main>
    </>
  );
}

// Standard page layout with navbar + footer
function PageLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="page-layout-main">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <PageLayout><Home /></PageLayout>
      } />
      <Route path="/about" element={
        <PageLayout><About /></PageLayout>
      } />
      <Route path="/blog" element={
        <PageLayout><Blog /></PageLayout>
      } />
      <Route path="/blog/:slug" element={
        <PageLayout><BlogPost /></PageLayout>
      } />
      <Route path="/contact" element={
        <PageLayout><Contact /></PageLayout>
      } />
      <Route path="/pricing" element={
        <PageLayout><Pricing /></PageLayout>
      } />
      <Route path="/login" element={
        <PageLayout><Login /></PageLayout>
      } />
      <Route path="/signup" element={
        <PageLayout><Signup /></PageLayout>
      } />
      <Route path="/dashboard" element={
        <PageLayout><Dashboard /></PageLayout>
      } />
      <Route path="/audit" element={<AuditLayout />} />
      <Route path="/legal" element={
        <PageLayout><Legal /></PageLayout>
      } />
      <Route path="/privacy" element={
        <PageLayout><PrivacyPolicy /></PageLayout>
      } />
      {/* Alias for /privacy-policy → same component */}
      <Route path="/privacy-policy" element={
        <PageLayout><PrivacyPolicy /></PageLayout>
      } />
      <Route path="/terms" element={
        <PageLayout><TermsOfService /></PageLayout>
      } />
      {/* Fallback */}
      <Route path="*" element={
        <PageLayout><Home /></PageLayout>
      } />
    </Routes>
  );
}
