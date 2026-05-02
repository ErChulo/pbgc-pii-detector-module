# Implementation Plan: PBGC PII Detection Workflow

**Branch**: `001-pbgc-pii-workflow` | **Date**: 2026-05-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-pbgc-pii-workflow/spec.md`

## Summary

Deliver the v0.4.0 PBGC PII detection workflow as a static browser-only single page app in
`pii-detection.v0.4.0`. The feature supports local file, directory, and drag-and-drop intake;
contextual PII detection; severity and confidence reporting; user disposition management;
redacted exports; manifest generation; PDF text renditions where feasible; and optional
password-protected archive packaging without server calls.

## Technical Context

**Language/Version**: JavaScript ES modules, HTML5, CSS3; package metadata uses Node-compatible Vite tooling for development only  
**Primary Dependencies**: Runtime CDN libraries for PDF text extraction, DOCX extraction, spreadsheet parsing, PDF text rendition generation, and zip creation; Vite as optional local development tooling  
**Storage**: Browser memory during review; user-selected local files and downloads/output directory for exports  
**Testing**: Manual synthetic PII review scenarios, browser runtime checks, JavaScript syntax checks, and no-server-call source scan  
**Target Platform**: Modern desktop browsers with local file selection support  
**Project Type**: Static single page browser application  
**Performance Goals**: Queue and start processing within 2 minutes for first-time users; process a 25-finding synthetic set across five supported document types; keep the review screen responsive for a 50-finding synthetic review  
**Constraints**: No backend service, uploads, telemetry, remote storage, or required build step for runtime operation; PII remains local to the browser session; output directory writing requires user permission; exact native-to-PDF conversion may be unavailable for some inputs  
**Scale/Scope**: v0.4.0 release directory `pii-detection.v0.4.0`; supported inputs include selected files, directory selections, and drag-and-drop files; exports include reports, manifest, redacted text, PDF text renditions where feasible, and optional password zip status

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- PBGC policy alignment: PASS. Plan maps feature behavior to IM 05-09 and IM 10-03 obligations for minimizing exposure, protecting PII, recording decisions, and disposing/redacting when no longer needed.
- Browser-only processing: PASS. Runtime design keeps all document processing in the browser with no backend service, telemetry, uploads, or required build step.
- Contextual detection and severity: PASS. Findings include file identity, PII type, context, confidence, severity, policy basis, and disposition.
- User-governed remediation: PASS. Users review findings and choose retain, redact, erase, or needs review; destructive actions are represented in export evidence.
- Versioned delivery and exports: PASS. v0.4.0 metadata, changelog, manifest, export time, source file list, and archive/encryption status are required.
- Synthetic verification: PASS. Quickstart and research require synthetic PII samples; production PII is excluded unless a documented PBGC policy deviation exists.

**Post-design re-check**: PASS. Research, data model, contracts, and quickstart preserve all constitution gates. No unjustified violations are present.

## Project Structure

### Documentation (this feature)

```text
specs/001-pbgc-pii-workflow/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── export-package.schema.json
│   └── ui-workflow-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
pii-detection.v0.4.0/
├── index.html
├── package.json
├── vite.config.js
├── VERSION
├── CHANGELOG.md
├── README.md
└── src/
    ├── main.js
    └── styles.css
```

**Structure Decision**: Use the existing `pii-detection.v0.4.0` release directory as a static SPA.
Vite files are retained only for local development and optional packaging. Runtime use remains direct
browser access to `index.html`.

## Complexity Tracking

No constitution violations require justification.
