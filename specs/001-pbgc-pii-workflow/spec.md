# Feature Specification: PBGC PII Detection Workflow

**Feature Branch**: `001-pbgc-pii-workflow`  
**Created**: 2026-05-02  
**Status**: Draft  
**Input**: User description: "Need to continue developing and enhancing this project. Create a v0.4.0 PBGC PII detector single page application that detects PII in context, reports findings, values severity, manages findings, disposes, erases, or redacts in place, follows PBGC IM 05-09 and IM 10-03, accepts files or directories through selection or drag and drop, presents tasks in a clear pop-up panel, exports output for downstream modules or LLM analysis, preferably converts inputs to PDF, supports password-encrypted zip output, and enforces version control."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Process Local Documents for PII (Priority: P1)

A PBGC user selects one or more local documents, or a local directory of documents, and starts a privacy review. The app identifies supported files, processes them locally, and displays findings with enough context for the user to understand what was detected and where it appeared.

**Why this priority**: Detection in context is the core value of the tool. Without a reliable intake and detection flow, reporting, management, and redaction cannot be trusted.

**Independent Test**: Provide a folder containing synthetic documents with known SSNs, names, email addresses, phone numbers, addresses, financial identifiers, and technical secrets. Start processing and verify that findings are shown per file with type, context, confidence, and severity.

**Acceptance Scenarios**:

1. **Given** a user has selected supported files containing synthetic PII, **When** the user starts processing, **Then** the app shows each detected PII finding with file identity, PII type, nearby context, confidence, and severity.
2. **Given** a user drags supported files onto the app, **When** the files are dropped, **Then** the app queues them for processing without requiring a server upload.
3. **Given** a user selects a local directory, **When** the directory contains a mix of supported and unsupported files, **Then** the app processes supported files and reports skipped or unreadable files without stopping the whole review.

---

### User Story 2 - Review Severity and Manage Findings (Priority: P2)

A PBGC user reviews the detected findings, understands the assigned severity scale, and chooses a disposition for each finding such as retain, redact, erase, or needs review.

**Why this priority**: PBGC users must be able to manage PII decisions rather than receive a passive list of matches. Severity and disposition decisions are necessary for privacy risk handling.

**Independent Test**: Process a synthetic file with low, medium, high, and critical findings. Verify that the user can filter or inspect findings, see the severity rationale, and assign a disposition to every finding.

**Acceptance Scenarios**:

1. **Given** findings have been detected, **When** the user reviews the findings table, **Then** each finding has a severity level from the defined scale and a default disposition appropriate to its risk.
2. **Given** a finding is a false positive or approved for retention, **When** the user changes its disposition, **Then** the app preserves that decision in the review record.
3. **Given** high-risk findings remain unresolved, **When** the user prepares to export, **Then** the report identifies those findings as still requiring review or action.

---

### User Story 3 - Export Redacted Review Package (Priority: P3)

After reviewing findings, a PBGC user exports a package containing reports, redacted outputs, a manifest, and policy references suitable for downstream modules or controlled LLM analysis.

**Why this priority**: The project output must be usable beyond the initial review session. A controlled export package supports auditability, downstream processing, and secure transport.

**Independent Test**: Complete a review of synthetic files, choose dispositions, enter an export password, and verify that the downloaded or selected output location contains reports, redacted material, and a manifest without unnecessary unredacted PII exposure.

**Acceptance Scenarios**:

1. **Given** reviewed findings, **When** the user exports output, **Then** the app produces a structured findings report, a human-readable report, a manifest, and redacted document representations.
2. **Given** the user supplies a password for portable output, **When** encrypted archive support is available, **Then** the app creates a password-protected archive and records archive limitations in the manifest.
3. **Given** exact conversion to PDF is not available for a source file, **When** export runs, **Then** the app records the limitation and still exports extracted text or a redacted rendition suitable for downstream review.

---

### User Story 4 - Understand the Required Workflow (Priority: P4)

A PBGC user opens the app and sees a clear workflow panel explaining the required sequence: detect in context, report findings, value severity, manage decisions, and dispose, erase, or redact.

**Why this priority**: The user must understand the privacy-handling sequence before acting on sensitive information. The workflow panel reduces missed steps.

**Independent Test**: Open the app and verify that the workflow panel presents the five required tasks and PBGC policy basis before processing begins or remains available during processing.

**Acceptance Scenarios**:

1. **Given** the app is opened, **When** the user views the workflow panel, **Then** all five required tasks are presented in clear language.
2. **Given** the user has dismissed the workflow panel, **When** the user needs to review the process again, **Then** the panel can be reopened without losing queued files or findings.

### Edge Cases

- If a selected file is corrupted, password-protected, unsupported, or too large for the browser to read, the app records the file-level issue and continues processing other files.
- If the same PII value appears multiple times, the app records distinct contextual occurrences while avoiding duplicate entries for the same occurrence.
- If no PII is found, the app still produces a report and manifest showing the files processed and the absence of findings.
- If browser capabilities do not permit writing to a user-selected output directory, the app falls back to a user-initiated download and records that limitation.
- If password-protected archive support is unavailable, the app does not claim encryption and records the limitation in the manifest.
- If a user attempts destructive disposition without reviewing findings, the app requires explicit confirmation and records unresolved decisions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to select one or more local files for processing.
- **FR-002**: System MUST allow users to select a local directory and process relevant supported files inside it.
- **FR-003**: System MUST allow users to drag and drop files into the review interface.
- **FR-004**: System MUST process input documents locally without uploading document content to any remote service.
- **FR-005**: System MUST identify PII findings with file identity, PII type, matched value handling, nearby context, confidence, severity, and policy basis.
- **FR-006**: System MUST use a defined severity scale with at least low, medium, high, and critical levels.
- **FR-007**: System MUST distinguish direct identifiers, linkable identifiers, financial or tax identifiers, credentials, and technical secrets.
- **FR-008**: System MUST present the required tasks in a clear workflow panel: detect in context, report findings, value severity, manage findings, and dispose, erase, or redact.
- **FR-009**: System MUST allow users to assign a disposition to each finding, including retain, redact, erase, and needs review.
- **FR-010**: System MUST preserve user disposition decisions in exported reports.
- **FR-011**: System MUST provide a structured findings report suitable for downstream modules or controlled LLM analysis.
- **FR-012**: System MUST provide a human-readable report suitable for review and audit.
- **FR-013**: System MUST export a manifest identifying source files, tool version, export time, policy references, outputs, and known limitations.
- **FR-014**: System MUST create redacted or erased output representations based on user dispositions.
- **FR-015**: System MUST prefer PDF output representations when feasible and record any conversion limitation when exact PDF conversion is not feasible.
- **FR-016**: System MUST offer password-protected archive export when browser capabilities and selected libraries support it.
- **FR-017**: System MUST not claim encrypted output when password-protected archive support is unavailable.
- **FR-018**: System MUST support output to a user-selected destination when the browser permits directory writing, with a download fallback when it does not.
- **FR-019**: System MUST maintain visible version metadata for the current release line v0.4.0.
- **FR-020**: System MUST maintain source control traceability for feature, specification, and release changes.
- **FR-PBGC-001**: System MUST identify PBGC IM 05-09 and IM 10-03 obligations affected by this feature.
- **FR-PBGC-002**: System MUST preserve browser-only processing with no server calls unless explicitly rejected by governance.
- **FR-PBGC-003**: System MUST define severity, confidence, user remediation actions, and export evidence for PII findings.

### Key Entities *(include if feature involves data)*

- **Input Document**: A user-selected file with name, path or relative path, type, size, processing status, extracted text status, and conversion limitations.
- **PII Finding**: A detected occurrence with file identity, PII type, masked value, context, location if available, confidence, severity, policy basis, and current disposition.
- **Severity Rating**: A risk value assigned to a finding using the defined low, medium, high, and critical scale.
- **Disposition Decision**: A user action assigned to a finding, including retain, redact, erase, or needs review, with export evidence.
- **Export Package**: A set of reports, redacted outputs, manifest, policy references, version metadata, and optional password-protected archive metadata.
- **Workflow Task**: One of the required user-facing stages: detection, reporting, severity valuation, management, and disposal/redaction.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can queue files or a directory and start processing in under 2 minutes.
- **SC-002**: In a synthetic test set containing at least 25 known PII occurrences across five supported document types, at least 90% of direct identifiers are reported with correct type and severity.
- **SC-003**: 100% of reported findings include file identity, PII type, severity, confidence, and nearby context or a clear reason context is unavailable.
- **SC-004**: A user can assign a disposition to every finding in a synthetic 50-finding review set without leaving the main review screen.
- **SC-005**: Exported output includes a structured report, human-readable report, manifest, and redacted representation for every processed file.
- **SC-006**: 100% of exports include tool version, export time, source file list, policy references, and known limitations.
- **SC-007**: No document content is transmitted outside the user's browser during normal processing.
- **SC-008**: When archive encryption is unavailable, the user-facing export result and manifest clearly state that the package is not password-protected.

## Assumptions

- PBGC users running the app have authority to access and review the selected local documents.
- Test and demonstration files use synthetic PII unless a documented PBGC policy deviation authorizes production PII.
- The app is intended for modern desktop browsers with local file selection support.
- Browser security rules require user participation for selecting input files and output destinations.
- Exact native conversion from every supported input format to PDF may not be possible in-browser; an extracted redacted rendition is acceptable when limitations are recorded.
- Downstream modules and LLM workflows consume exported reports and redacted representations rather than raw unredacted source documents by default.

## PBGC Privacy and Runtime Constraints *(mandatory)*

- Policy basis: The feature is governed by PBGC IM 05-09 Privacy Program and IM 10-03 Protecting Personally Identifiable Information, including protecting PII from unauthorized access or disclosure, minimizing use, safeguarding dissemination, and disposing of PII when no longer needed.
- PII data handling: PII-bearing documents remain local to the user's browser session; reports mask values unless retention is explicitly selected; destructive actions require user choice and review evidence.
- Remediation evidence: Retain, redact, erase, and needs-review decisions are recorded per finding in structured and human-readable exports.
- Export constraints: Export packages include a manifest, policy references, version metadata, redacted outputs, known limitations, and password-protected archive status for downstream module or controlled LLM intake.
- Versioning: Release work uses v0.4.0 metadata, a changelog entry, and source control traceability for specification and implementation changes.
