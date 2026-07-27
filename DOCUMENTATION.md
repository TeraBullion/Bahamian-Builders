# Bahamian Builders LLC — Website Documentation

End-to-end documentation for the Bahamian Builders marketing site and lead pipeline.
Last updated: July 27, 2026.

---

## 1. Overview

| | |
|---|---|
| **Live site** | https://bahamianbuilders.com |
| **Fallback URL** | https://bahamian-builders.vercel.app |
| **Repo** | https://github.com/TeraBullion/Bahamian-Builders |
| **Hosting** | Vercel — project `bahamian-builders` (account `emmanuel-1423`) |
| **Domain/DNS** | GoDaddy (registrar + DNS) |
| **CRM** | GoHighLevel sub-account "Bahamian Builders LLC" (location `eneldfyYVrnMfNLkaEHo`) under the Tera bullion agency |
| **Stack** | Static HTML/CSS/JS built with Vite 6 + one Vercel serverless function |

A 7-page static marketing site for a Houston site-work & concrete contractor.
The only dynamic piece is the contact form, which pushes leads into GoHighLevel.

## 2. Pages

| Page | File | Notes |
|------|------|-------|
| Home | `index.html` | Hero, services preview, animated stats, projects preview, testimonials, CTA |
| About | `about.html` | Story, values, team, company timeline (3-column grid; left rail on mobile) |
| Services | `services.html` | Site work / concrete / general construction + process steps |
| Projects | `projects.html` | Filterable gallery (6 cards) + lightbox |
| Contact | `contact.html` | Lead form (→ GHL), info cards, Google Maps embed |
| Privacy | `privacy.html` | `noindex`; standard small-business policy |
| Terms | `terms.html` | `noindex`; standard terms, Texas governing law |

Shared behavior lives in `js/main.js` (navbar, mobile nav, scroll-reveal animations,
stat counters — counters skip the "+" when a `data-suffix` is present).
`js/projects.js` handles gallery filtering + lightbox. `js/contact.js` handles
form validation + submission.

## 3. Lead pipeline (contact form → GoHighLevel)

```
contact.html form
   └─ js/contact.js  — client-side validation, POST JSON to /api/contact,
                        loading state, success panel only on HTTP 200,
                        error fallback shows the phone number
        └─ api/contact.js  — Vercel serverless function (CommonJS, Node runtime)
             ├─ validates name/email/service/message
             ├─ POST https://services.leadconnectorhq.com/contacts/upsert
             │    body: locationId, firstName/lastName (split), email, phone,
             │          source: "Website Contact Form",
             │          tags: ["website-lead", <service-slug>]
             └─ POST /contacts/{id}/notes — full project message + CT timestamp
                  (note failure logs but doesn't fail the submission)
```

- **Auth**: GHL *Private Integration* token ("Website Contact Form", scopes
  `contacts.readonly` + `contacts.write`). Sent as `Authorization: Bearer`,
  `Version: 2021-07-28`.
- **Secrets**: `GHL_API_TOKEN` and `GHL_LOCATION_ID` are encrypted Vercel
  environment variables (Production). Nothing sensitive ships to the client.
- **Rotation**: sub-account Settings → Private Integrations → Website Contact
  Form. If the token is rotated, update `GHL_API_TOKEN` in Vercel and redeploy.
- **Verified**: test submission "website test" (websitetest@example.com) landed
  in the CRM with correct source/tags/note. That contact can be deleted.
- Where leads appear: sub-account → Contacts. Source field and `website-lead`
  tag identify site submissions; the message is on the contact's Notes.

## 4. Build & deploy

```bash
npm run dev        # local dev server (port 3000)
npm run build      # vite build → dist/ (7 HTML inputs in vite.config.js)
npx vercel deploy --prod   # deploy dist + api/ to production
```

- **Pushing to GitHub does NOT auto-deploy.** Deploys are CLI-driven.
- Vite rewrites `<img src>`/`<link href>` asset URLs to hashed filenames.
  **Gotcha**: it does *not* rewrite custom attributes like `data-image` — the
  projects lightbox therefore reads the card's rendered `<img>.src` instead of
  `data-image` (see `js/projects.js`).
- `api/` is deployed as-is by Vercel (not part of the Vite build).

## 5. Domain & DNS

- `bahamianbuilders.com` + `www` are attached to the Vercel project.
- GoDaddy DNS records:
  - `A @ → 76.76.21.21`
  - `CNAME www → cname.vercel-dns.com`
- `www` 308-redirects to the apex (configured via Vercel API:
  `PATCH /v9/projects/{id}/domains/www.bahamianbuilders.com` with
  `{"redirect":"bahamianbuilders.com","redirectStatusCode":308}`).
- SSL is auto-provisioned by Vercel.

## 6. Design system notes

- Palette: navy `#0A2240` (`--navy`), teal/ocean gradient accents, amber CTAs;
  fonts via CSS variables in `css/main.css`.
- **Logo**: `assets/images/logo_icon.png` is a square PNG with a baked-in navy
  background. It is displayed as a circular badge (`border-radius: 50%` +
  teal ring) in navbar and footer so it blends on any background. The wordmark
  reads "BAHAMIAN BUILDERS" (LLC intentionally dropped from branding; legal
  name kept in copyright line, titles, and legal copy).
- **Wave dividers**: `.wave-divider` (navy top) after dark heroes;
  `.wave-divider-flip` (white band) before the footer on light pages;
  `.wave-divider-navy` variant un-flips and overlaps the CTA section so
  navy CTA → footer transitions stay dark (used on the 5 main pages).
- **Hero scroll indicator**: hidden below 850px viewport height (it collided
  with the CTAs) and `pointer-events: none`.
- **Timeline (About)**: desktop is a 3-column grid — content | year badge on
  the center line | content, alternating; ≤768px switches to a left rail
  (60px/50px badge column, line centered through badges).
- **Responsive guards**: `overflow-x: clip` on `html` (entrance animations
  translate elements off-canvas); `min-width: 0` on contact-layout children;
  contact info sidebar single-column ≤620px; touch devices disable hover zooms.
- **Gallery**: `.project-card.mirror` flips a repeated photo horizontally
  (compose flips with hover scale; also preserved in the touch media query).

## 7. Known placeholders & open items

| Item | Status |
|------|--------|
| Phone `(713) 555-0187` | Fictional 555 number, kept deliberately until the client provides a real line. Appears in navbar, footer, contact page, legal pages, GHL profile. |
| `info@bahamianbuilders.com` | Shown on the site but mailbox may not exist. Leads don't depend on it (they go to GHL). Consider GoDaddy email forwarding. |
| Social links | Removed from footers; `.footer-social` CSS retained for when profiles exist. |
| 6th project photo | Card reuses a mirrored copy of the 5th photo; replace when a real 6th photo exists. AI-render PNGs in `assets/images` are unused (style clash). |
| "Across America" copy | Broad framing kept per owner decision; tighten to Houston/Texas if the client prefers. |
| GHL integration description | Still mentions vercel.app (cosmetic only). |

## 8. Operational runbook

- **Change site content**: edit HTML/CSS → `npm run build` → `npx vercel deploy --prod` → commit + push.
- **Add a page**: create the HTML, add it to `rollupOptions.input` in `vite.config.js`, link it in navs/footers.
- **Check leads**: GHL sub-account → Contacts (filter tag `website-lead`).
- **Form suddenly failing**: check Vercel function logs; then confirm the GHL token is still valid (`401 → rotated/revoked`). The client-side error message directs users to call.
- **Rotate GHL token**: Private Integrations → rotate → update `GHL_API_TOKEN` env var → redeploy.
- **Update business info in GHL**: use the *agency* view → Sub-Accounts → account detail page. (The sub-account's own Business Profile settings page renders in an iframe that is unreliable.)
- **DNS changes**: GoDaddy → bahamianbuilders.com → Manage DNS.
