# PBGC PII Detection v0.4.0

Static browser app for detecting, reviewing, scoring, managing, and redacting
PII in local documents. The app is intended for PBGC privacy workflows aligned
with IM 05-09 and IM 10-03.

## Runtime Model

- Open `index.html` directly in a browser for static use.
- No server calls, telemetry, uploads, or remote storage are used by app code.
- CDN libraries are referenced from `index.html` for document parsing and export.
- `npm run dev` is available only for Vite development convenience.
- The header theme button switches between high-contrast light and dark themes.
- Detector precision rules downgrade common PBGC directive, version, page,
  section, actuarial, rate, dollar, plan-code, and citation values unless nearby
  context supports a PII interpretation.

## Export Notes

Browsers cannot silently create a directory beside the app without user consent.
When supported, use the output directory picker to create `pii-output-v0.4.0`.
Otherwise, the app downloads the export zip through the normal browser download
flow. Sensitive transport packages are blocked unless zip.js password protection
is available and the user supplies a password of at least 12 characters using at
least three of uppercase letters, lowercase letters, numbers, and symbols.

DB and SQLite files are recorded as browser-limited unless a browser-safe
extractor is added. Redact and erase decisions require explicit confirmation
before the exported redacted outputs apply those decisions. The manifest records
whether the archive was password-protected, whether export was blocked, detector
validation evidence, policy references, and any limitations encountered.

Password-protected archive export is a transport safeguard. The app does not
claim FIPS 140-3 validation unless that can be demonstrated for the actual
browser/library encryption path.
