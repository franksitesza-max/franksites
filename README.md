# Frank Sites Website

Production website for Frank Sites, built with React, Vite, and a Vercel contact API.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a prerendered production build in `dist/`.
- `npm run preview` previews the built site locally.
- `npm run lint` runs ESLint checks.

## Deployment (Vercel)

This project deploys on Vercel with a frontend build plus a serverless contact endpoint.

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

## Contact Form Setup

The contact form now submits to `api/contact.js` on Vercel instead of using FormSubmit.

Add these environment variables in Vercel:

- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `CONTACT_FROM`
- `ALLOWED_ORIGINS`

Recommended values:

- `CONTACT_EMAIL=franksitesza@gmail.com`
- `CONTACT_FROM=Frank Sites <onboarding@resend.dev>` for initial testing
- `ALLOWED_ORIGINS=https://franksites.co.za,https://www.franksites.co.za`

For production, verify your sending domain in Resend and replace `CONTACT_FROM` with an address on your own domain.

Current hardening in the contact route:

- origin allowlist with automatic support for same-origin Vercel previews
- honeypot field
- minimum submit-time check
- server-side validation and sanitization
- basic per-IP rate limiting to protect the free email quota

## Notes

- `public/robots.txt` and `public/sitemap.xml` are included.
- `public/site.webmanifest` is included.
- Metadata and Open Graph tags are defined in `index.html`.
- Contact form posts to the Vercel serverless route in `api/contact.js`.
- SEO settings for React-rendered pages are centralized in `src/seo/siteSeo.js`.
