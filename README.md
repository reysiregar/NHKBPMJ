# Naposobulung HKBP Mustikajaya Website

This is the official website for Naposobulung HKBP Mustikajaya (NHKBP MJ), a youth community at HKBP Mustikajaya church.

- Built with: HTML, CSS (Tailwind), JavaScript
- Purpose: Share information about the youth community, events, gallery, and contact details.
- Deployed at: https://nhkbpmj.vercel.app

## UI / Design System Improvements (2025-11)

Recent enhancements focused on accessibility, consistency, and theming:

### Design Tokens
Defined in `src/style.css` under `:root` and overridden in `.dark`:
```
--primary / --primary-hover
--secondary
--accent / --accent-hover
--surface / --surface-alt
--border
--shadow-color
--text / --text-muted
--focus-ring
```
Use these variables for new components instead of hardcoded colors.

### Dark Mode
Toggle buttons (`#theme-toggle`, `#theme-toggle-mobile`) persist preference via `localStorage (theme-preference)`.
Implementation adds/removes `dark` class on `<html>` (`document.documentElement`).

### Accessibility
- Added `role="dialog"`, `aria-modal="true"`, and labels for modals/lightbox.
- Added focus outline via `:focus-visible` and consistent ring styling.
- Navigation has `role="navigation"` and proper labeling.

### Performance & UX
- Logo now has explicit `width/height` to reduce layout shift.
- Reduced motion users get minimized animations via `prefers-reduced-motion`.

### Extending
When adding new interactive elements:
- Prefer buttons with `aria-label` for icon-only actions.
- Reuse `.theme-toggle-btn` pattern for compact controls.
- Use token-based colors and transitions with `var(--transition-base)`.

## Local Development

Open `index.html` via a simple static server (optional for local testing of routing/hash behavior):
```bash
python3 -m http.server 8080
```
Visit http://localhost:8080/src/index.html

## Future Suggestions
- Componentize repeated card patterns.
- Add semantic landmarks (`<main>`) wrapper.
- Integrate service worker for asset caching if needed.

