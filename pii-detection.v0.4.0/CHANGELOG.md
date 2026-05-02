# pii-detection

## v0.4.0

- Created static Vite-compatible single page app from the v0.4.0 materials.
- Added browser-only PII detection workflow for files and selected directories.
- Added PBGC policy references for IM 05-09 and IM 10-03.
- Added contextual findings, confidence, severity scoring, and review actions.
- Added task workflow panel for detect, report, value, manage, and dispose/redact.
- Added JSON, CSV, HTML, manifest, redacted text, optional PDF rendition, and zip export.
- Added optional password-protected zip export through CDN zip.js when available.
- Added explicit confirmation for redact and erase decisions before export remediation is applied.
- Added browser-limitation records for unsupported, unreadable, DB, and SQLite inputs.
- Aligned structured JSON output with the export manifest contract.
- Added persistent dark/light theme toggle with higher-contrast theme color tokens.
