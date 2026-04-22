// ── WriteArticleButton ────────────────────────────────────────────────────────
// Trigger button shown inside BlogBriefOutput

import React, { useState } from 'react';
import WriteArticleModal from './WriteArticleModal';

export default function WriteArticleButton({ brief, url }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="wa-trigger-btn"
        onClick={() => setOpen(true)}
        title="Write a full SEO article from this brief"
      >
        <span>📝</span>
        <span>Write Full Article</span>
      </button>

      {open && (
        <WriteArticleModal
          brief={brief}
          url={url}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
