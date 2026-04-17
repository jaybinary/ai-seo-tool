// ── PageIQ Contact Form Handler ───────────────────────────────────────────────
// Saves submission to Supabase + sends thank-you email to user + internal alert
// Uses: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY

const { createClient } = require('@supabase/supabase-js');

// ── Email templates ───────────────────────────────────────────────────────────

function thankYouEmailHTML(name) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thanks for reaching out — PageIQ</title>
</head>
<body style="margin:0;padding:0;background:#f6f8fc;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f0c29,#302b63,#1a237e);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;background:linear-gradient(135deg,#a5b4fc,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:#a5b4fc;letter-spacing:-0.03em;">PageIQ</div>
              <div style="font-size:12px;color:#64748b;margin-top:4px;letter-spacing:0.08em;text-transform:uppercase;">AI SEO Intelligence</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:0 0 16px;letter-spacing:-0.02em;">
                Hi ${name}, we got your message 👋
              </h1>
              <p style="font-size:15px;color:#475569;line-height:1.75;margin:0 0 20px;">
                Thanks for reaching out to PageIQ. We've received your enquiry and a member of our team will get back to you within <strong>24 hours</strong> (Mon–Fri, 9am–6pm IST).
              </p>

              <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:18px 20px;margin:0 0 24px;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#0369a1;margin-bottom:8px;">What happens next</div>
                <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;">
                  <li style="font-size:13px;color:#0c4a6e;">Our team reviews your message and matches it to the right person</li>
                  <li style="font-size:13px;color:#0c4a6e;">You'll hear from us within 24 hours with a tailored response</li>
                  <li style="font-size:13px;color:#0c4a6e;">If urgent, email us directly at <a href="mailto:support@pageiq.app" style="color:#0369a1;">support@pageiq.app</a></li>
                </ul>
              </div>

              <p style="font-size:14px;color:#475569;line-height:1.75;margin:0 0 28px;">
                While you wait, why not run a free AI SEO audit on your website? It takes under 2 minutes and gives you 11 actionable insights — no sign-up required.
              </p>

              <div style="text-align:center;margin-bottom:28px;">
                <a href="https://pageiq.app/audit"
                  style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;font-size:14px;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;">
                  Run a Free Audit →
                </a>
              </div>

              <hr style="border:none;border-top:1px solid #f1f5f9;margin:0 0 20px;"/>

              <p style="font-size:12px;color:#94a3b8;margin:0;line-height:1.6;">
                You're receiving this because you submitted a contact form at <a href="https://pageiq.app" style="color:#6366f1;">pageiq.app</a>. If this wasn't you, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
              <p style="font-size:12px;color:#475569;margin:0;">© 2024 PageIQ · <a href="https://pageiq.app" style="color:#64748b;">pageiq.app</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function internalAlertHTML({ name, email, phone, company, message }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f6f8fc;font-family:'Inter',-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="background:#0f172a;border-radius:12px 12px 0 0;padding:20px 32px;">
              <span style="font-size:16px;font-weight:800;color:#a5b4fc;">PageIQ</span>
              <span style="font-size:12px;color:#475569;margin-left:12px;">New Contact Form Submission</span>
            </td>
          </tr>
          <tr>
            <td style="background:#fff;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
              <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 20px;">
                📬 New message from ${name}
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:20px;">
                ${[
                  ['Name', name],
                  ['Email', email],
                  ['Phone', phone || '—'],
                  ['Company', company || '—'],
                ].map(([label, value], i) => `
                <tr style="background:${i % 2 === 0 ? '#f8fafc' : '#fff'}">
                  <td style="padding:10px 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;width:110px;">${label}</td>
                  <td style="padding:10px 16px;font-size:14px;color:#0f172a;font-weight:500;">${value}</td>
                </tr>`).join('')}
              </table>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin-bottom:8px;">Message</div>
                <div style="font-size:14px;color:#334155;line-height:1.75;">${message.replace(/\n/g, '<br/>')}</div>
              </div>
              <a href="mailto:${email}?subject=Re: Your PageIQ enquiry"
                style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:13px;font-weight:700;padding:11px 22px;border-radius:8px;text-decoration:none;">
                Reply to ${name} →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Handler ───────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const { name, email, phone, company, message } = body;

  // ── Server-side validation (defence in depth) ─────────────────────────────
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Name, email and message are required.' }) };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email address.' }) };
  }
  if (message.trim().length < 10) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Message too short.' }) };
  }

  // ── 1. Save to Supabase ───────────────────────────────────────────────────
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { error: dbError } = await supabase
    .from('contact_submissions')
    .insert({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      phone:   phone?.trim() || null,
      company: company?.trim() || null,
      message: message.trim(),
    });

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to save submission. Please try again.' }) };
  }

  // ── 2. Send thank-you email to user ──────────────────────────────────────
  try {
    await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    'PageIQ <hello@pageiq.app>',
        to:      [email.trim()],
        subject: `We've received your message, ${name.trim().split(' ')[0]}`,
        html:    thankYouEmailHTML(name.trim().split(' ')[0]),
      }),
    });
  } catch (err) {
    // Email failure must not block the success response — submission is already saved
    console.error('Thank-you email failed:', err.message);
  }

  // ── 3. Send internal alert to team ───────────────────────────────────────
  try {
    await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    'PageIQ Forms <hello@pageiq.app>',
        to:      ['expert@pageiq.app'],
        subject: `New contact: ${name.trim()} ${company ? `(${company.trim()})` : ''}`,
        html:    internalAlertHTML({ name: name.trim(), email: email.trim(), phone: phone?.trim() || '', company: company?.trim() || '', message: message.trim() }),
      }),
    });
  } catch (err) {
    console.error('Internal alert email failed:', err.message);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true }),
  };
};
