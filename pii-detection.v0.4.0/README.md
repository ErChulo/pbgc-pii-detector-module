# PBGC PII Detection v0.4.0

Static browser app for detecting, reviewing, scoring, managing, and redacting
PII in local documents. The app is intended for PBGC privacy workflows aligned
with IM 05-09 and IM 10-03.

## Runtime Model

- Open `index.html` directly in a browser for static use.
- No server calls, telemetry, uploads, or remote storage are used by app code.
- Compliance basis is read from local `im-05-09.pdf` and `im-10-03.pdf` in the
  repository root.
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
before the exported redacted outputs apply those decisions. Redacted text and PDF
renditions preserve surrounding non-PII content for OCR and LLM analysis, and
replace only sensitive values with typed placeholders such as `[REDACTED_SSN]`
or `[ERASED_BANK_ACCOUNT_CONTEXT]`. The manifest records whether the archive was
password-protected, whether export was blocked, detector validation evidence,
policy references, and any limitations encountered.

Password-protected archive export is a transport safeguard. The app does not
claim FIPS 140-3 validation unless that can be demonstrated for the actual
browser/library encryption path. IM 10-03 still requires PBGC-approved data
encryption or secure file transfer for electronic dissemination of PII outside
PBGC, and CPO approval for removal of PII from PBGC or contractor devices,
networks, or the workplace. The app records those limitations but cannot grant
approval.

## Directive Mapping

The feature policy mapping is documented in
`specs/002-detector-precision-encryption/policy-mapping.md`.
