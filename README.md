# PBGC PII Detector Module

Static browser-based detector for reviewing documents for Personal Identifiable
Information (PII) before actuarial material is transported, shared, redacted, or
prepared for downstream analysis.

The current release is `v0.4.0`.

## Open The App

Use the single-file SPA release artifact:

`pii-detection.v0.4.0/release/pbgc-pii-detection-v0.4.0.html`

Download that file from the repository and open it in a modern desktop browser.
The app runs locally in the browser. It does not upload documents to a server.

## What The Detector Accomplishes

The detector helps PBGC actuaries and reviewers inspect local files for possible
PII before those files are exported, redacted, transported, emailed, or provided
to another module or LLM workflow.

It supports the following workflow:

1. Select or drop local files, or select a local directory.
2. Extract readable text from supported documents.
3. Detect possible direct, linkable, financial, tax, contact, credential, and
   technical identifiers.
4. Evaluate context around each match to reduce common false positives.
5. Assign severity and confidence evidence.
6. Present findings for human review.
7. Let the reviewer retain, redact, erase, mark false positive, or leave a
   finding unresolved.
8. Export reports, manifest evidence, redacted text/PDF renditions where
   feasible, and a password-protected zip when sensitive output exists.

## Why It Exists

Actuarial work often includes documents with participant, beneficiary, payee,
plan, payment, valuation, and administrative information. Some values resemble
PII even when they are ordinary actuarial or policy references, while other
values become sensitive because of surrounding context.

This tool gives actuaries a local review step before material leaves their
working environment. The goal is to preserve useful document meaning for further
analysis while reducing unnecessary exposure of sensitive identifiers.

The app is intended to support PBGC privacy workflows aligned with:

- PBGC IM 05-09 Privacy Program
- PBGC IM 10-03 Protecting Personally Identifiable Information
- Privacy Act of 1974, 5 U.S.C. 552a
- OMB M-17-12 breach response expectations
- NIST SP 800-53 security and privacy control concepts

The app records policy references and limitations in its output. It does not
grant PBGC approval, replace official records management, replace breach
reporting, or certify that a browser-based password zip path is FIPS validated.

## How It Works

The detector is a static single page application. Processing happens in the
browser using local file APIs and CDN-loaded browser libraries for document
parsing and export.

Built-in detectors look for patterns such as:

- Social Security numbers
- taxpayer, EIN, routing, or account-like identifiers
- email addresses and phone numbers
- date-of-birth patterns
- address-like text
- payment or banking context
- credentials and technical secrets
- IP addresses and other technical identifiers

Context rules then inspect nearby text. For example, values near words such as
`participant`, `beneficiary`, `SSN`, `DOB`, `bank`, or `account` are treated as
more likely to be sensitive. Values near terms such as `page`, `section`,
`version`, `rate`, `liability`, `citation`, `U.S.C.`, or `C.F.R.` are downgraded
when the surrounding text indicates a policy, actuarial, or document-control
reference rather than PII.

The app also includes a Custom regex dialog. Users can create, edit, and delete
additional regex tests for agency-specific or case-specific identifiers. These
custom tests are stored locally in browser IndexedDB and remain available in the
same browser profile.

## How Actuaries Should Use It

Use this as a pre-transport review tool when preparing actuarial files for:

- internal review packages
- controlled handoff to another PBGC module
- redacted working copies
- secure email packaging
- downstream OCR or LLM analysis where sensitive identifiers should be removed
  but the remaining document meaning should stay readable

Recommended workflow:

1. Open `pii-detection.v0.4.0/release/pbgc-pii-detection-v0.4.0.html`.
2. Select files, select a directory, or drag files into the intake area.
3. Review the Workflow panel if you need a reminder of the five-step process.
4. Add custom regex rules if the case has special identifiers not covered by
   the built-in library.
5. Click Process queue.
6. Review every finding.
7. For each finding, choose the correct disposition:
   `Retain`, `Redact`, `Erase`, `False positive`, or `Unresolved`.
8. Enter and confirm a strong password when sensitive output exists.
9. Click Export reviewed output.
10. Use the exported zip, manifest, reports, and redacted outputs for the next
    controlled workflow step.

The redacted outputs use neutral placeholders: `[REDACTED]` or `[ERASED]`.
They avoid labels such as `Redacted_SSN` so the output does not introduce new
suspicious identifier terms. Non-PII surrounding text is preserved so OCR and
LLM tools can still understand the document.

## Supported Inputs

The app accepts common local files including:

- PDF
- DOCX
- XLSX
- CSV and TSV
- TXT, MD, HTML
- JSON and XML
- DB and SQLite files as recorded browser-limited inputs

Some formats depend on browser-safe extraction libraries. If text cannot be
extracted, the app records a processing limitation instead of silently ignoring
the file.

## Export And Password Protection

Sensitive export packages are blocked unless password protection is available
and a strong password is supplied. The password must be at least 12 characters
and include at least three of the following: uppercase letters, lowercase
letters, numbers, and symbols.

The export package can include:

- JSON findings report
- CSV findings report
- human-readable HTML report
- manifest with version, policy, limitation, and encryption evidence
- redacted text outputs
- redacted PDF text renditions where browser PDF generation is available
- password-protected zip archive

If the browser supports folder selection, the app can write into a selected
output directory. If not, the export downloads through the browser downloads
folder.

## Security And Compliance Boundaries

The app is designed for local review. It does not send files to a backend,
telemetry endpoint, or remote storage service.

Important limitations:

- CDN libraries must be reachable unless an offline-bundled version is created.
- Browser password-protected zip export is a local safeguard, not a formal PBGC
  approval or FIPS validation claim.
- IM 10-03 still requires PBGC-approved encryption or secure file transfer for
  electronic dissemination outside PBGC.
- Removal of PII from PBGC or contractor devices, networks, or workplaces still
  requires the applicable PBGC authorization.
- Official breach reporting, records management, CUI disposal, and retention
  rules still apply.

## Repository Layout

- `pii-detection.v0.4.0/release/pbgc-pii-detection-v0.4.0.html`:
  office-ready single-file SPA artifact
- `pii-detection.v0.4.0/index.html`:
  development/static source entry
- `pii-detection.v0.4.0/src/main.js`:
  detector, review, export, and IndexedDB logic
- `pii-detection.v0.4.0/src/styles.css`:
  light/dark theme and layout styling
- `specs/`:
  Specify/Speckit planning, policy mapping, contracts, and task evidence
- `im-05-09.pdf` and `im-10-03.pdf`:
  PBGC policy source documents used as compliance basis

## Development Checks

From `pii-detection.v0.4.0`:

```powershell
npm.cmd run build
```

From the repository root:

```powershell
node --check pii-detection.v0.4.0\src\main.js
```

The runtime release for users is still the tracked single-file HTML under the
`release` folder.
