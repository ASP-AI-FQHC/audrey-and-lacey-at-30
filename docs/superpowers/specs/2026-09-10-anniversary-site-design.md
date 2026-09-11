# Audrey & Lacey at 30 — site design

Approved in chat on 2026-09-10. Owner: Guy Fuller. Domain: AudreyandLaceyat30.com (GoDaddy).

## Purpose
A keepsake for Audrey (she) and Lacey (he) Watkins, marking thirty years of marriage,
built from the photos and clips of the anniversary celebration held on the evening of
August 16, 2026. Guests will mostly open it from a text message on a phone.

## Decisions
- Front door: the printed banner portrait (IMG_3136), cropped to the fabric edges.
- Names read "Audrey & Lacey" to match the domain.
- Sections: front door, a note from Guy, curated gallery (best of each near-duplicate
  pair, ten images including the banner), three clips, closing line.
- Hosting: static site on GitHub Pages with the custom domain; DNS at GoDaddy.
- No guestbook, no backend, no AI-generated imagery. Real photos only.

## Design plan
- Palette: ballroom plum-black #14101A ground; ivory #F2EBDD text; ash #A79FB0
  secondary; chandelier gold #C9A961 for the ampersand and rules only; feather
  purple #5B3A8C as the one deep accent (from the centerpieces).
- Type: Bodoni Moda for display (italic for the names), Mulish for body.
  One memorable element: the names set very large beside the banner portrait.
- Layout: left-aligned text, image-led. Desktop hero splits text left, banner right;
  mobile stacks with the banner full-bleed. Gallery is a 12-column editorial grid
  with varied spans and a lightbox. Clips are three 9:16 players, the sharp
  19-second clip first.
- Motion: one page-load sequence on the hero and the lightbox open/close. Nothing else.
  Respects prefers-reduced-motion.
- Copy: sentence case, plain verbs, no caps eyebrows, no numbered markers, no
  decorative labels.

## Files
- site/index.html, site/styles.css, site/script.js, site/photos/*, site/media/*,
  site/CNAME.
- originals/, jpg/, thumbs/ are working folders, not published.
