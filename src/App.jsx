import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Audit from './pages/Audit';

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
      {/* Fallback */}
      <Route path="*" element={
        <PageLayout><Home /></PageLayout>
      } />
    </Routes>
  );
}
