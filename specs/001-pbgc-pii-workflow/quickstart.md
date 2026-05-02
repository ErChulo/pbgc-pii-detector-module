# Quickstart: PBGC PII Detection Workflow

## Prerequisites

- Use a modern desktop browser.
- Use synthetic PII files for validation unless PBGC policy deviation approval exists.
- Open the static app from `pii-detection.v0.4.0/index.html`, or use optional local development tooling.

## Static Runtime Check

1. Open `pii-detection.v0.4.0/index.html` in the browser.
2. Confirm the workflow panel appears or can be opened.
3. Confirm the panel lists detect, report, value severity, manage, and dispose/redact tasks.
4. Confirm PBGC IM 05-09 and IM 10-03 are referenced.

## Synthetic Review Scenario

1. Prepare synthetic files containing examples of:
   - SSN
   - email
   - phone number
   - address
   - financial identifier
   - credential or technical secret
2. Select individual files and process them.
3. Drag and drop at least one file and process it.
4. Select a directory containing supported and unsupported files.
5. Verify findings include file identity, PII type, context, confidence, severity, and policy basis.
6. Change at least one finding to each disposition: retain, redact, erase, and needs review.

## Export Scenario

1. Enter a test password in the archive password field.
2. Choose an output directory if the browser supports it.
3. Export reviewed output.
4. Verify output includes:
   - Structured findings report
   - Human-readable report
   - Manifest
   - Redacted text output
   - PDF text renditions where available
   - Zip archive or a clear limitation if archive support is unavailable
5. Confirm the manifest includes tool version, export time, source file list, policy references,
   outputs, and known limitations.

## Verification Commands

From the repository root:

```powershell
node --check pii-detection.v0.4.0\src\main.js
node --check pii-detection.v0.4.0\vite.config.js
rg "fetch\(|XMLHttpRequest|sendBeacon|WebSocket|http://" pii-detection.v0.4.0
```

The source scan should not show app-initiated server-call paths. CDN references in `index.html` are
allowed by the constitution when documented.
