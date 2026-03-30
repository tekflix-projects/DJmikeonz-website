# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page marketing website for DJ MIKEONZ, a fusion wedding DJ. Pure HTML/CSS/JS — no build tools, no frameworks, no package manager. Open `index.html` directly in a browser to preview.

## Architecture

Three files make up the entire site:

- **`index.html`** — All markup. Sections flow in order: `#navbar → #hero → #about → #videos → #social → #reviews → #booking → #footer`. Each section has an HTML comment header (e.g., `<!-- ========== BOOKING FORM ========== -->`).
- **`style.css`** — All styles. The `:root` block at the top holds every color, font, and spacing variable — color scheme changes should only touch `:root`. Sections are separated by comment headers matching the HTML.
- **`main.js`** — All interactivity, wrapped in a single `DOMContentLoaded` listener. Handles: navbar scroll state, hamburger menu, smooth scroll (offset by navbar height), IntersectionObserver fade-ins, active nav link tracking, and Formspree AJAX form submission.

## Placeholder Content to Replace

The site has several placeholders that need real content before going live:

| Placeholder | Location | What to replace with |
|---|---|---|
| `VIDEO_ID_1/2/3` | `index.html` `#videos` iframes | Real YouTube video IDs |
| `YOUR_FORM_ID` | `index.html` form `action` + guard in `main.js:123` | Formspree form ID from formspree.io |
| `https://open.spotify.com` | Social section + footer | Real Spotify profile URL |
| `href="#"` on Google Reviews button | `index.html:276` | Google Business Profile reviews URL |
| `.photo-placeholder` / `.photo-initials` | About section | Replace `<div class="photo-initials">` with `<img src="..." alt="DJ MIKEONZ">` |
| `.social-img-placeholder` divs (×6) | Social section | Add `background-image: url(...)` or replace with `<img>` tags |

## Styling Conventions

- **Color/font changes:** Edit `:root` variables in `style.css` only — no hardcoded values elsewhere.
- **Section backgrounds:** `#0a0a0a` (primary) alternates with `#111111` via `.section-dark` class on `<section>`.
- **Fonts:** `Cormorant Garamond` (headings/display, `var(--font-display)`) + `Inter` (body, `var(--font-body)`).
- **Responsive breakpoints:** 640px (tablet) and 1024px (desktop) in `style.css`. The mobile nav drawer fires below 1024px.

## Adding Reviews

Copy any `.review-card` block in `index.html` and paste it before the closing `</div>` of `.reviews-carousel`. The carousel is horizontal scroll snap — no JS changes needed.

## Git & GitHub

- **Repo:** `tekflix-projects/DJmikeonz-website` (private)
- **Branch:** `main`
- **Push command:** `git push origin main`

### Commit discipline (required)

Commit and push to GitHub **throughout the work** — not just at the end. Every completed unit of work (a feature added, a section updated, a bug fixed, a placeholder replaced) should get its own commit before moving on. This ensures no work is ever lost and the history is always in a clean, recoverable state.

Commit message format:
- One concise subject line describing *what changed and why* (e.g. `Replace VIDEO_ID placeholders with real YouTube embeds`)
- Stage only the files relevant to that change — never batch unrelated edits into one commit

A Stop hook in `.claude/settings.json` auto-commits any remaining uncommitted changes at the end of each session as a safety net, but it does not replace making explicit, well-named commits during the work.
