<!--
Sync Impact Report
Version change: 0.0.0 -> 1.0.0
Modified principles:
- Template placeholders -> I. PBGC Privacy Compliance
- Template placeholders -> II. Browser-Only Document Processing
- Template placeholders -> III. Contextual Detection and Severity
- Template placeholders -> IV. User-Governed Remediation
- Template placeholders -> V. Versioned, Auditable Delivery
Added sections:
- Product Constraints
- Development Workflow and Quality Gates
Removed sections:
- Placeholder SECTION_2_NAME
- Placeholder SECTION_3_NAME
Templates requiring updates:
- updated: .specify/templates/plan-template.md
- updated: .specify/templates/spec-template.md
- updated: .specify/templates/tasks-template.md
- not present: .specify/templates/commands/*.md
Follow-up TODOs: None
-->
# PBGC PII Detector Constitution

## Core Principles

### I. PBGC Privacy Compliance
The product MUST support PBGC handling of Personally Identifiable Information
under IM 05-09, PBGC Privacy Program, and IM 10-03, Protecting Personally
Identifiable Information. Features MUST minimize exposure of PII, protect PII
from unauthorized access or disclosure, support disposal when no longer needed,
and make exceptions explicit. Test data MUST be synthetic unless a documented
policy deviation authorizes production PII.

Rationale: The app exists to help PBGC identify and control sensitive personal
data, so policy compliance is a functional requirement, not a documentation
afterthought.

### II. Browser-Only Document Processing
The application MUST be a single-page browser application that processes files
locally. It MUST NOT require a backend service, server calls, telemetry, remote
storage, or a mandatory build step to operate. External runtime libraries, when
needed, MUST be loaded from documented CDN URLs and isolated to browser-safe
uses. The deliverable MUST remain usable as static files, with packaging into a
single HTML artifact treated as a release task.

Rationale: PII-bearing input documents must not leave the user's workstation
during detection, reporting, severity valuation, management, redaction, erasure,
or packaging.

### III. Contextual Detection and Severity
Detection MUST report each finding with document identity, location or nearby
context when available, PII type, confidence, and a severity value on a defined
scale. Detection rules MUST distinguish direct identifiers, linkable indirect
identifiers, financial/tax identifiers, credentials, and technical secrets.
False-positive controls MUST preserve auditability by recording suppressions or
user decisions instead of silently dropping material findings.

Rationale: PBGC privacy risk depends on both the data element and the context in
which it appears; a raw pattern match is not sufficient for operational use.

### IV. User-Governed Remediation
The app MUST present detection, reporting, severity review, management, and
disposal/redaction tasks in a clear workflow panel before or during processing.
Users MUST be able to review findings, decide retain/redact/erase actions, and
export a machine-readable report of those decisions. Destructive remediation
MUST require explicit user confirmation and MUST preserve an output report that
does not expose unredacted PII unnecessarily.

Rationale: PII remediation affects records, legal obligations, and downstream
analysis; the user must control decisions and retain evidence of what occurred.

### V. Versioned, Auditable Delivery
Every implementation change MUST maintain explicit version metadata, a
changelog entry, and source control traceability. Release directories MUST carry
their intended version in names and metadata. Output packages MUST include a
manifest describing source files, findings, actions, policy references, tool
version, and export time. Encryption for portable output archives MUST be
offered whenever browser capabilities and chosen libraries support it.

Rationale: Privacy tooling must be reproducible, reviewable, and suitable for
handoff to downstream PBGC modules or controlled LLM analysis.

## Product Constraints

The current release line is v0.4.0. The working app directory for this release
MUST be `pii-detection.v0.4.0`, built from the prior `v0.4.0` materials while
preserving static-browser operation. Relevant inputs include individual files,
drag-and-drop selections, and directory selections using browser file APIs.
Preferred processing converts inputs or extracted representations toward PDF
outputs where feasible in-browser; when exact conversion is not feasible, the
export MUST record the limitation and preserve extracted text and reports.

Supported exports MUST include structured JSON and at least one human-readable
format. Zipped export with a user-selected password is a target capability, but
any implementation MUST clearly identify browser/library limitations and MUST
not claim cryptographic protection that is not actually provided.

## Development Workflow and Quality Gates

Plans, specs, and tasks MUST include checks for PBGC IM 05-09 and IM 10-03
alignment, browser-only processing, no server calls, explicit severity scale,
user-confirmed remediation, export manifest, and version metadata. Changes that
touch detection, remediation, exports, or policy mapping MUST include focused
manual or automated verification using synthetic PII samples. Git status MUST
be reviewed before and after changes; unrelated user changes MUST be preserved.

For release work, the static app must be openable directly from `index.html`.
Vite or other tooling MAY be present for development ergonomics only; runtime
operation MUST NOT depend on a dev server or build output unless the release
task explicitly packages a separate artifact.

## Governance

This constitution supersedes conflicting development habits for this repository.
Amendments MUST update this file, identify the semantic version bump, and review
dependent Spec Kit templates for consistency. Major version changes redefine or
remove governance requirements. Minor version changes add principles, sections,
or materially expanded obligations. Patch version changes clarify wording
without changing required behavior.

Every feature plan and implementation review MUST document compliance with the
Core Principles. Any known deviation MUST identify the risk, compensating
controls, affected files, and whether PBGC policy approval would be required
before operational use.

**Version**: 1.0.0 | **Ratified**: 2026-05-02 | **Last Amended**: 2026-05-02
