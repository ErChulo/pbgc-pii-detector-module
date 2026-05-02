# Research: PBGC PII Detection Workflow

## Decision: Static browser-only runtime

**Rationale**: The constitution and specification require PII-bearing documents to remain local.
Browser file APIs support user-selected files, drag-and-drop files, and directory selection in
modern desktop browsers. Keeping runtime processing in the browser avoids uploads, server-side
storage, telemetry, and backend access controls that would expand the privacy boundary.

**Alternatives considered**: A local desktop app would provide stronger file-system control but adds
installation and packaging scope. A server-backed app would simplify processing but violates the
browser-only and no-server-call constraints.

## Decision: Vite as optional development tooling only

**Rationale**: The user requested a Vite project, while the constitution requires no mandatory build
step. The plan keeps Vite metadata and scripts for development convenience but treats `index.html`
and source files as the operable release artifact.

**Alternatives considered**: A full Vite build pipeline would conflict with the no-required-build
runtime requirement. A plain folder without package metadata would fail the requested Vite project
shape.

## Decision: Contextual findings with masked reporting by default

**Rationale**: PBGC privacy risk depends on the detected element and its surrounding context. Findings
must include type, context, confidence, severity, policy basis, and disposition. Export reports mask
values unless the user explicitly retains them, reducing unnecessary exposure in downstream packages.

**Alternatives considered**: Reporting raw matches everywhere is simpler but creates avoidable PII
exposure. Reporting only counts is safer but not actionable for review or remediation.

## Decision: Four-level severity scale

**Rationale**: Low, medium, high, and critical levels are understandable for reviewers and map cleanly
to common risk triage. Critical covers direct financial identifiers and credentials; high covers
direct or strongly linkable personal identifiers; medium covers common contact and address data; low
covers technical identifiers that may become sensitive in combination.

**Alternatives considered**: Numeric-only scoring is harder for non-technical review. More granular
scales add false precision before the detector has enough policy-specific calibration data.

## Decision: User disposition workflow

**Rationale**: The app must support management and remediation, not just detection. Retain, redact,
erase, and needs-review states cover the required outcomes while preserving an auditable record of
user decisions.

**Alternatives considered**: Automatic redaction of all findings may remove legitimate records or
false positives. Manual notes without structured states are harder for downstream modules to consume.

## Decision: Export package with manifest and optional password archive

**Rationale**: Downstream modules and controlled LLM analysis need structured data, human-readable
reports, redacted representations, and provenance. A manifest records source files, version, policy
references, output inventory, archive status, and limitations. Password-protected zip output is
offered only when browser support and the selected archive library can actually provide it.

**Alternatives considered**: Exporting only JSON is insufficient for human review. Exporting only
HTML is insufficient for downstream automation. Claiming encryption without supported archive
behavior would be misleading and unsafe.

## Decision: Extracted text PDF renditions where exact conversion is unavailable

**Rationale**: Browser-only exact conversion from all source formats to native PDF is not reliable.
The plan therefore prefers PDF renditions when feasible and records limitations when a redacted text
rendition is the accurate output.

**Alternatives considered**: Requiring perfect conversion for every input would block the release.
Skipping PDF output entirely would miss the user's stated preference and downstream review needs.

## Decision: Synthetic validation data

**Rationale**: PBGC policy and the constitution require minimizing production PII use. Synthetic
files can validate detection, severity, review, redaction, and export behavior without exposing real
individuals.

**Alternatives considered**: Real PBGC documents would improve realism but require policy deviation
and approval. Empty fixtures would not validate privacy behavior.
