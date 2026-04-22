// ── BlogBriefButton ───────────────────────────────────────────────────────────
// Drop-in trigger button for the Audit results page.
// Usage:
//   import BlogBriefButton from '../components/BlogBrief/BlogBriefButton';
//   <BlogBriefButton url={url} auditSnapshot={states} />
//
// `auditSnapshot` = the `states` object from Audit.jsx (all 11 skill results)

import React, { useState } from 'react';
import BlogBriefModal from './BlogBriefModal';

export default function BlogBriefButton({ url, auditSnapshot = {} }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="bb-trigger-btn"
        onClick={() => setOpen(true)}
        title="Generate a structured blog brief from this audit"
      >
        <span className="bb-trigger-icon">✍️</span>
        <span>Generate Blog Brief</span>
      </button>

      {open && (
        <BlogBriefModal
          url={url}
          auditSnapshot={auditSnapshot}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
