---
description: "Task list for PBGC PII Detection Workflow implementation"
---

# Tasks: PBGC PII Detection Workflow

**Input**: Design documents from `/specs/001-pbgc-pii-workflow/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: The specification requires synthetic validation and browser runtime checks. Formal automated tests are not required for this task set.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Static app**: `pii-detection.v0.4.0/`
- **Application source**: `pii-detection.v0.4.0/src/`
- **Feature docs**: `specs/001-pbgc-pii-workflow/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm release metadata and static project structure are ready for implementation.

- [ ] T001 Verify `pii-detection.v0.4.0/package.json` declares version 0.4.0 and Vite-only development scripts
- [ ] T002 Verify `pii-detection.v0.4.0/VERSION` contains 0.4.0
- [ ] T003 [P] Update `pii-detection.v0.4.0/CHANGELOG.md` with any implementation changes made during this feature
- [ ] T004 [P] Verify `pii-detection.v0.4.0/README.md` documents static browser runtime and export limitations
- [ ] T005 [P] Verify `pii-detection.v0.4.0/index.html` references only documented CDN libraries and local source files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared browser-only data flow, policy mapping, and export contract structures that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T006 Define shared review-state objects for input documents, extracted documents, findings, dispositions, and export metadata in `pii-detection.v0.4.0/src/main.js`
- [ ] T007 Define PBGC policy reference constants for IM 05-09 and IM 10-03 in `pii-detection.v0.4.0/src/main.js`
- [ ] T008 Define severity scale constants and ordering for low, medium, high, and critical in `pii-detection.v0.4.0/src/main.js`
- [ ] T009 Define supported file extension handling and skipped-file limitation handling in `pii-detection.v0.4.0/src/main.js`
- [ ] T010 [P] Add base responsive layout tokens for panels, tables, controls, and status messaging in `pii-detection.v0.4.0/src/styles.css`
- [ ] T011 [P] Verify no app-initiated server-call paths are present in `pii-detection.v0.4.0/src/main.js`
- [ ] T012 [P] Review export JSON contract requirements in `specs/001-pbgc-pii-workflow/contracts/export-package.schema.json` before implementing export generation

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Process Local Documents for PII (Priority: P1) MVP

**Goal**: Users can select files, select a directory, drag and drop files, process supported documents locally, and see contextual findings.

**Independent Test**: Use synthetic files containing known SSNs, names, emails, phone numbers, addresses, financial identifiers, and technical secrets; verify findings show file identity, type, context, confidence, and severity.

### Implementation for User Story 1

- [ ] T013 [US1] Implement file input queueing for selected files in `pii-detection.v0.4.0/src/main.js`
- [ ] T014 [US1] Implement directory input queueing with relative path preservation in `pii-detection.v0.4.0/src/main.js`
- [ ] T015 [US1] Implement drag-and-drop queueing behavior in `pii-detection.v0.4.0/src/main.js`
- [ ] T016 [US1] Implement text extraction routing for TXT, MD, HTML, CSV, TSV, JSON, XML, PDF, DOCX, and XLSX inputs, and record DB/SQLite files as browser-limited unless a browser-safe extractor is added, in `pii-detection.v0.4.0/src/main.js`
- [ ] T017 [US1] Implement unreadable, unsupported, corrupted, or password-protected file limitation records in `pii-detection.v0.4.0/src/main.js`
- [ ] T018 [US1] Implement PII detector definitions for direct identifiers, linkable identifiers, financial or tax identifiers, credentials, and technical secrets in `pii-detection.v0.4.0/src/main.js`
- [ ] T019 [US1] Implement contextual finding creation with masked values, confidence, severity, policy basis, and location data in `pii-detection.v0.4.0/src/main.js`
- [ ] T020 [US1] Implement processing progress and queue status updates in `pii-detection.v0.4.0/src/main.js`
- [ ] T021 [US1] Render findings table rows with source file, PII type, severity, confidence, context, and policy basis in `pii-detection.v0.4.0/src/main.js`
- [ ] T022 [US1] Style intake, progress, and findings table states for desktop and mobile layouts in `pii-detection.v0.4.0/src/styles.css`

**Checkpoint**: User Story 1 is independently functional and can serve as the MVP.

---

## Phase 4: User Story 2 - Review Severity and Manage Findings (Priority: P2)

**Goal**: Users can review severity, filter findings, and assign retain, redact, erase, or needs-review dispositions.

**Independent Test**: Process a synthetic file with low, medium, high, and critical findings; verify each finding can be reviewed and assigned a disposition without leaving the main review screen.

### Implementation for User Story 2

- [ ] T023 [US2] Implement default disposition assignment based on severity in `pii-detection.v0.4.0/src/main.js`
- [ ] T024 [US2] Implement severity summary counts for total, high or critical, and needs-review findings in `pii-detection.v0.4.0/src/main.js`
- [ ] T025 [US2] Implement severity filtering for the findings table in `pii-detection.v0.4.0/src/main.js`
- [ ] T026 [US2] Implement disposition selector handling for retain, redact, erase, and needs review in `pii-detection.v0.4.0/src/main.js`
- [ ] T027 [US2] Implement explicit confirmation for redact and erase disposition changes before they affect export state in `pii-detection.v0.4.0/src/main.js`
- [ ] T028 [US2] Preserve user-changed disposition decisions in review state and export state in `pii-detection.v0.4.0/src/main.js`
- [ ] T029 [US2] Style severity badges, summary metrics, and disposition controls in `pii-detection.v0.4.0/src/styles.css`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Export Redacted Review Package (Priority: P3)

**Goal**: Users can export structured and human-readable reports, a manifest, redacted representations, PDF text renditions where feasible, and optional password zip output.

**Independent Test**: Complete a synthetic review, choose dispositions, enter an export password, and verify the exported package includes reports, redacted material, manifest, version metadata, policy references, and accurate archive limitations.

### Implementation for User Story 3

- [ ] T030 [US3] Implement structured findings report generation matching `specs/001-pbgc-pii-workflow/contracts/export-package.schema.json` in `pii-detection.v0.4.0/src/main.js`
- [ ] T031 [US3] Implement human-readable HTML and CSV report generation in `pii-detection.v0.4.0/src/main.js`
- [ ] T032 [US3] Implement export manifest generation with source files, outputs, tool version, policy references, export time, and limitations in `pii-detection.v0.4.0/src/main.js`
- [ ] T033 [US3] Implement redacted and erased text output generation based on disposition decisions in `pii-detection.v0.4.0/src/main.js`
- [ ] T034 [US3] Implement PDF text rendition generation when browser PDF generation is available in `pii-detection.v0.4.0/src/main.js`
- [ ] T035 [US3] Implement output directory selection and download fallback behavior in `pii-detection.v0.4.0/src/main.js`
- [ ] T036 [US3] Implement optional password-protected zip export and explicit not-encrypted limitation reporting in `pii-detection.v0.4.0/src/main.js`
- [ ] T037 [US3] Style export controls and export status messaging in `pii-detection.v0.4.0/src/styles.css`

**Checkpoint**: User Stories 1, 2, and 3 produce a complete review and export package.

---

## Phase 6: User Story 4 - Understand the Required Workflow (Priority: P4)

**Goal**: Users can view and reopen a clear task workflow panel explaining detect, report, value severity, manage, and dispose/redact.

**Independent Test**: Open the app, verify the workflow panel presents all five tasks and PBGC policy basis, dismiss it, and reopen it without losing queued files or findings.

### Implementation for User Story 4

- [ ] T038 [US4] Implement workflow dialog markup for the five required tasks in `pii-detection.v0.4.0/index.html`
- [ ] T039 [US4] Implement workflow dialog open, close, and reopen behavior without clearing review state in `pii-detection.v0.4.0/src/main.js`
- [ ] T040 [US4] Add PBGC IM 05-09 and IM 10-03 policy basis text to the workflow panel in `pii-detection.v0.4.0/index.html`
- [ ] T041 [US4] Style workflow dialog layout and mobile behavior in `pii-detection.v0.4.0/src/styles.css`

**Checkpoint**: All user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify the release against the constitution, contracts, and quickstart.

- [ ] T042 Run JavaScript syntax checks for `pii-detection.v0.4.0/src/main.js` and `pii-detection.v0.4.0/vite.config.js`
- [ ] T043 Run no-server-call source scan against `pii-detection.v0.4.0/`
- [ ] T044 Validate `pii-detection.v0.4.0/index.html` manually with synthetic PII samples following `specs/001-pbgc-pii-workflow/quickstart.md`
- [ ] T045 Verify PBGC IM 05-09 and IM 10-03 policy mapping in `pii-detection.v0.4.0/src/main.js`
- [ ] T046 Verify export manifest, version metadata, and encrypted archive behavior against `specs/001-pbgc-pii-workflow/contracts/export-package.schema.json`
- [ ] T047 Update release notes for completed behavior in `pii-detection.v0.4.0/CHANGELOG.md`
- [ ] T048 Update runtime and export limitation documentation in `pii-detection.v0.4.0/README.md`
- [ ] T049 Validate generated export JSON against `specs/001-pbgc-pii-workflow/contracts/export-package.schema.json`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational phase; establishes MVP document intake and detection.
- **User Story 2 (Phase 4)**: Depends on Foundational phase and can be layered on US1 findings.
- **User Story 3 (Phase 5)**: Depends on US1 document/finding data and US2 disposition decisions.
- **User Story 4 (Phase 6)**: Depends on Foundational phase and can be completed independently of export work.
- **Polish (Phase 7)**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational; no dependency on other user stories.
- **User Story 2 (P2)**: Can start after Foundational but needs finding records produced by US1 for end-to-end validation.
- **User Story 3 (P3)**: Requires findings from US1 and disposition decisions from US2.
- **User Story 4 (P4)**: Can start after Foundational; no dependency on other user stories.

### Within Each User Story

- Data state before rendering.
- Input processing before detection.
- Detection before review controls.
- Review dispositions before export.
- Export package creation before archive/download behavior.

### Parallel Opportunities

- T003, T004, and T005 can run in parallel.
- T010, T011, and T012 can run in parallel after T006-T009.
- T013, T014, and T015 can be developed together if handlers avoid conflicts.
- T023, T024, and T025 can be developed together after findings render.
- T029, T030, and T031 can be developed together after export state is stable.
- T037, T039, and T040 can be developed while US2 or US3 work proceeds.

---

## Parallel Example: User Story 1

```bash
Task: "T013 [US1] Implement file input queueing for selected files in pii-detection.v0.4.0/src/main.js"
Task: "T014 [US1] Implement directory input queueing with relative path preservation in pii-detection.v0.4.0/src/main.js"
Task: "T015 [US1] Implement drag-and-drop queueing behavior in pii-detection.v0.4.0/src/main.js"
```

## Parallel Example: User Story 3

```bash
Task: "T029 [US3] Implement structured findings report generation matching specs/001-pbgc-pii-workflow/contracts/export-package.schema.json in pii-detection.v0.4.0/src/main.js"
Task: "T030 [US3] Implement human-readable HTML and CSV report generation in pii-detection.v0.4.0/src/main.js"
Task: "T031 [US3] Implement export manifest generation with source files, outputs, tool version, policy references, export time, and limitations in pii-detection.v0.4.0/src/main.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate document intake, local processing, and contextual findings with synthetic PII samples.

### Incremental Delivery

1. Add User Story 1 for local intake and detection.
2. Add User Story 2 for severity review and management decisions.
3. Add User Story 3 for redacted exports and packaging.
4. Add User Story 4 for workflow guidance if not completed in parallel.
5. Run Phase 7 validation and update release notes.

### Format Validation

- All tasks use `- [ ] T###` checklist format.
- User-story tasks include `[US1]`, `[US2]`, `[US3]`, or `[US4]`.
- Setup, Foundational, and Polish tasks omit story labels.
- Every task includes an exact file path.
