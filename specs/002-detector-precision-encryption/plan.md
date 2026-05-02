# Implementation Plan: Detector Precision and Enforced Encryption

**Branch**: `002-detector-precision-encryption` | **Date**: 2026-05-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-detector-precision-encryption/spec.md`

## Summary

Harden the v0.4.0 PBGC PII detector so sensitive transport packages cannot be exported without password protection, while improving detector precision for actuarial, policy, regulatory, document-control, and ordinary numeric values that resemble PII. The plan preserves the existing static browser-only SPA in `pii-detection.v0.4.0`, adds auditable encryption enforcement evidence to exports, and expands synthetic validation for false positives and true positives.

## Technical Context

**Language/Version**: JavaScript ES modules, HTML5, CSS3; package metadata uses Node-compatible Vite tooling for development only  
**Primary Dependencies**: Existing runtime CDN libraries for document parsing, PDF text rendition generation, and zip creation; Vite remains optional local development tooling only  
**Storage**: Browser memory during review; user-selected local files and downloads/output directory for exports; no remote storage  
**Testing**: Manual synthetic PII review scenarios, synthetic false-positive and true-positive validation set, browser runtime checks, JavaScript syntax checks, export manifest inspection, and no-server-call source scan  
**Target Platform**: Modern desktop browsers with local file selection, directory selection where available, drag-and-drop, download, and optional directory write support  
**Project Type**: Static single page browser application  
**Performance Goals**: Preserve responsive review for a 50-finding synthetic review; complete disposition and protected export for a 25-finding sample in under 10 minutes; suppress or downgrade at least 90% of non-PII synthetic controls while preserving at least 95% true-positive controls  
**Constraints**: No backend service, uploads, telemetry, remote storage, or required build step for runtime operation; PII remains local to the browser session; sensitive transport packages must be blocked unless password protection succeeds; browser/library cryptographic validation must not be overstated  
**Scale/Scope**: v0.4.0 release directory `pii-detection.v0.4.0`; feature affects detector scoring, review explanations, export controls, manifests, reports, README/changelog/version metadata, and synthetic validation documentation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- PBGC policy alignment: PASS. The feature strengthens IM 05-09 and IM 10-03 support by requiring protected transport, preserving disposition evidence, and mapping encryption limitations to privacy risk.
- Browser-only processing: PASS. All detection, review, redaction, reporting, and export behavior remains local in the static browser app; no server calls or remote storage are introduced.
- Contextual detection and severity: PASS. The feature explicitly adds contextual confidence downgrades, severity preservation for true PII, and reviewer-visible explanations.
- User-governed remediation: PASS. The existing review workflow remains user-directed; export is blocked only to enforce mandatory protection for sensitive transport.
- Versioned delivery and exports: PASS. Plan requires version/changelog updates and manifest evidence for encryption enforcement, validation limitations, detector rules, and export time.
- Synthetic verification: PASS. Plan requires synthetic controls for false positives, true positives, ambiguous context, password blocking, and encrypted export evidence.

**Post-design re-check**: PASS. Research, data model, contracts, and quickstart preserve all constitution gates. No unjustified violations are present.

## Project Structure

### Documentation (this feature)

```text
specs/002-detector-precision-encryption/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- encrypted-export-contract.md
|   |-- detector-precision-contract.md
|   `-- manifest.schema.json
`-- checklists/
    `-- requirements.md
```

### Source Code (repository root)

```text
pii-detection.v0.4.0/
|-- index.html
|-- package.json
|-- vite.config.js
|-- VERSION
|-- CHANGELOG.md
|-- README.md
`-- src/
    |-- main.js
    `-- styles.css
```

**Structure Decision**: Continue using the existing `pii-detection.v0.4.0` static SPA. Vite remains available only for local development checks; runtime operation must continue to work by opening `index.html` directly.

## Complexity Tracking

No constitution violations require justification.
