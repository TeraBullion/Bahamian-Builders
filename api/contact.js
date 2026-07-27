/* ================================================================
   BAHAMIAN BUILDERS — api/contact.js
   Vercel serverless function: pushes contact form submissions
   into GoHighLevel (Bahamian Builders LLC sub-account) as
   contacts, with the project details attached as a note.
   Requires env vars: GHL_API_TOKEN, GHL_LOCATION_ID
   ================================================================ */

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

const SERVICE_LABELS = {
  'site-work': 'Site Work',
  'concrete-work': 'Concrete Work',
  'general-construction': 'General Construction',
  'other': 'Other',
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    console.error('Missing GHL_API_TOKEN or GHL_LOCATION_ID env var');
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { name, email, phone, service, message } = req.body || {};
  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const nameParts = String(name).trim().split(/\s+/);
  const firstName = nameParts.shift();
  const lastName = nameParts.join(' ');
  const serviceLabel = SERVICE_LABELS[service] || String(service);

  const ghlHeaders = {
    'Authorization': `Bearer ${token}`,
    'Version': GHL_API_VERSION,
    'Content-Type': 'application/json',
  };

  try {
    const upsertRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: ghlHeaders,
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : undefined,
        source: 'Website Contact Form',
        tags: ['website-lead', service],
      }),
    });

    if (!upsertRes.ok) {
      const detail = await upsertRes.text();
      console.error('GHL upsert failed:', upsertRes.status, detail);
      return res.status(502).json({ error: 'Failed to submit lead' });
    }

    const { contact } = await upsertRes.json();

    // Attach the project details as a note; a note failure shouldn't
    // fail the whole submission since the lead itself was captured.
    if (contact && contact.id) {
      const noteBody =
        `Website inquiry — ${serviceLabel}\n\n` +
        `${String(message).trim()}\n\n` +
        `Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} (CT)`;

      const noteRes = await fetch(`${GHL_API_BASE}/contacts/${contact.id}/notes`, {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: noteBody }),
      });
      if (!noteRes.ok) {
        console.error('GHL note create failed:', noteRes.status, await noteRes.text());
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('GHL request error:', err);
    return res.status(502).json({ error: 'Failed to submit lead' });
  }
};
