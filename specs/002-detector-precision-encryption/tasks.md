# Tasks: Detector Precision and Enforced Encryption

**Input**: Design documents from `/specs/002-detector-precision-encryption/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md
**Tests**: Synthetic validation and manual acceptance checks are required by the spec and quickstart.
**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or independent validation work.
- **[Story]**: Maps to the user story from `spec.md`.
- Every task includes an exact file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare version metadata, baseline documentation, and validation material before feature implementation.

- [X] T001 Review current export, manifest, detector, and action flow in `pii-detection.v0.4.0/src/main.js`
- [X] T002 [P] Add detector precision/encryption entry to `pii-detection.v0.4.0/CHANGELOG.md`
- [X] T003 [P] Add feature scope and transport warning notes to `pii-detection.v0.4.0/README.md`
- [X] T004 [P] Create synthetic validation sample plan in `specs/002-detector-precision-encryption/validation-samples.md`
- [X] T005 Confirm app version metadata remains consistent in `pii-detection.v0.4.0/VERSION`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared constants, state fields, and UI affordances needed by all three stories.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T006 Add policy reference, feature id, encryption status, and validation status constants in `pii-detection.v0.4.0/src/main.js`
- [X] T007 Add disposition constants for `retain`, `redact`, `erase`, `false_positive`, and `unresolved`, including migration from existing `needs_review` values, in `pii-detection.v0.4.0/src/main.js`
- [X] T008 Add password confirmation, encryption status, and validation summary elements in `pii-detection.v0.4.0/index.html`
- [X] T009 [P] Add visual styles for blocked/protected/limited encryption states in `pii-detection.v0.4.0/src/styles.css`
- [X] T010 Add shared manifest encryption and detector validation object builders in `pii-detection.v0.4.0/src/main.js`
- [X] T011 [P] Add no-server-call verification notes to `specs/002-detector-precision-encryption/quickstart.md`

**Checkpoint**: Shared UI and data structures are ready for story implementation.

---

## Phase 3: User Story 1 - Prevent Unencrypted Transport (Priority: P1) MVP

**Goal**: Sensitive transport packages cannot be exported unless password protection succeeds.

**Independent Test**: Process a document with confirmed or unresolved PII, attempt export without a password, verify export is blocked, then export with a valid password and verify manifest encryption evidence.

### Tests for User Story 1

- [X] T012 [P] [US1] Add encrypted export acceptance cases to `specs/002-detector-precision-encryption/validation-samples.md`
- [X] T013 [P] [US1] Add manifest schema expectations for blocked and protected exports in `specs/002-detector-precision-encryption/contracts/manifest.schema.json`

### Implementation for User Story 1

- [X] T014 [US1] Implement sensitive export detection for confirmed, suspected, and unresolved findings in `pii-detection.v0.4.0/src/main.js`
- [X] T015 [US1] Implement password acceptance requiring at least 12 characters and three character classes, plus confirmation validation before archive creation in `pii-detection.v0.4.0/src/main.js`
- [X] T016 [US1] Block sensitive export when password validation fails or zip password support is unavailable in `pii-detection.v0.4.0/src/main.js`
- [X] T017 [US1] Record `passwordRequired`, `passwordAccepted`, `passwordProtected`, `exportBlocked`, `encryptionStatus`, `validationClaim`, and limitations in `pii-detection.v0.4.0/src/main.js`
- [X] T018 [US1] Update export status messaging for protected, blocked, not-required, and limited states in `pii-detection.v0.4.0/src/main.js`
- [X] T019 [US1] Wire password confirmation and encryption status UI interactions in `pii-detection.v0.4.0/src/main.js`
- [X] T020 [US1] Update encrypted export user guidance in `pii-detection.v0.4.0/README.md`
- [ ] T021 [US1] Run the US1 manual export flow from `specs/002-detector-precision-encryption/quickstart.md`

**Checkpoint**: User Story 1 is independently functional and suitable as the MVP.

---

## Phase 4: User Story 2 - Reduce Obvious False Positives (Priority: P2)

**Goal**: Common PBGC actuarial, policy, regulatory, document-control, and numeric values are suppressed, downgraded, or explained without suppressing true PII.

**Independent Test**: Process the synthetic control sample and verify at least 90% false-positive controls are downgraded/suppressed while at least 95% true-positive controls remain detected.

### Tests for User Story 2

- [X] T022 [P] [US2] Add false-positive controls for directive, version, page, section, date, dollar, actuarial, plan-code, and citation examples in `specs/002-detector-precision-encryption/validation-samples.md`
- [X] T023 [P] [US2] Add true-positive controls for SSN, taxpayer identifier, participant identifier, address, phone, email, date of birth, payment data, and person-tied benefit examples in `specs/002-detector-precision-encryption/validation-samples.md`
- [X] T024 [P] [US2] Add detector precision validation result format to `specs/002-detector-precision-encryption/contracts/detector-precision-contract.md`

### Implementation for User Story 2

- [X] T025 [US2] Add context signal extraction for nearby PII-positive and PII-negative words in `pii-detection.v0.4.0/src/main.js`
- [X] T026 [US2] Add non-PII downgrade rules for PBGC directive numbers, versions, pages, sections, ordinary dates, dollars, rates, plan codes, and citations in `pii-detection.v0.4.0/src/main.js`
- [X] T027 [US2] Add true-positive guard rules for SSN, taxpayer identifiers, person-tied contact data, payment data, and benefit records in `pii-detection.v0.4.0/src/main.js`
- [X] T028 [US2] Add `confidenceReason` and `contextSignals` to every generated finding in `pii-detection.v0.4.0/src/main.js`
- [X] T029 [US2] Display confidence explanation and false-positive action in the findings table in `pii-detection.v0.4.0/src/main.js`
- [X] T030 [US2] Add synthetic detector validation summary generation in `pii-detection.v0.4.0/src/main.js`
- [ ] T031 [US2] Run the US2 synthetic precision flow from `specs/002-detector-precision-encryption/quickstart.md`

**Checkpoint**: User Story 2 is independently testable and does not weaken User Story 1.

---

## Phase 5: User Story 3 - Preserve Compliance Evidence (Priority: P3)

**Goal**: Reports and manifests show detector behavior, disposition evidence, encryption enforcement, version metadata, policy references, and limitations.

**Independent Test**: Complete a review session, export with a password, and inspect JSON/CSV/HTML reports plus `manifest.json` for policy, disposition, confidence, encryption, and validation evidence.

### Tests for User Story 3

- [X] T032 [P] [US3] Add compliance evidence acceptance cases to `specs/002-detector-precision-encryption/validation-samples.md`
- [X] T033 [P] [US3] Add report evidence expectations to `specs/002-detector-precision-encryption/contracts/encrypted-export-contract.md`

### Implementation for User Story 3

- [X] T034 [US3] Add feature id, policy references, detector validation summary, encryption record, and limitations to manifest generation in `pii-detection.v0.4.0/src/main.js`
- [X] T035 [US3] Add confidence reason, context signals, disposition timestamp, and false-positive status to JSON export in `pii-detection.v0.4.0/src/main.js`
- [X] T036 [US3] Add confidence reason and encryption summary fields to CSV export in `pii-detection.v0.4.0/src/main.js`
- [X] T037 [US3] Add compliance evidence and encryption summary sections to HTML report output in `pii-detection.v0.4.0/src/main.js`
- [X] T038 [US3] Update README compliance and limitations documentation in `pii-detection.v0.4.0/README.md`
- [ ] T039 [US3] Run the US3 manifest/report inspection flow from `specs/002-detector-precision-encryption/quickstart.md`

**Checkpoint**: All user stories are independently functional and reports are ready for downstream review.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, release documentation, and repository hygiene.

- [X] T040 [P] Run `npm.cmd run build` from `pii-detection.v0.4.0` using `pii-detection.v0.4.0/package.json`
- [X] T041 [P] Run source scan for server calls and remote storage paths in `pii-detection.v0.4.0/src/main.js`
- [X] T042 [P] Validate manifest schema JSON parses in `specs/002-detector-precision-encryption/contracts/manifest.schema.json`
- [ ] T043 Run complete quickstart validation from `specs/002-detector-precision-encryption/quickstart.md`
- [ ] T044 Time the 25-finding review/export flow from `specs/002-detector-precision-encryption/quickstart.md` and record whether completion is under 10 minutes in `specs/002-detector-precision-encryption/validation-samples.md`
- [X] T045 Update final validation notes in `specs/002-detector-precision-encryption/validation-samples.md`
- [X] T046 Confirm changelog and release metadata are final in `pii-detection.v0.4.0/CHANGELOG.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; MVP scope.
- **User Story 2 (Phase 4)**: Depends on Foundational; can run after or alongside US1 but must not weaken encrypted export behavior.
- **User Story 3 (Phase 5)**: Depends on Foundational; can run after US1 and US2 for complete evidence coverage.
- **Polish (Phase 6)**: Depends on all selected user stories.

### User Story Dependencies

- **US1 Prevent Unencrypted Transport**: No dependency on US2 or US3 after Foundational.
- **US2 Reduce Obvious False Positives**: No dependency on US1 after Foundational, but final validation must confirm US1 still passes.
- **US3 Preserve Compliance Evidence**: Can begin after Foundational, but final manifest/report coverage is most complete after US1 and US2.

### Parallel Opportunities

- Setup documentation tasks T002-T004 can run in parallel.
- Foundational CSS and quickstart tasks T009 and T011 can run in parallel with shared JavaScript preparation.
- US1 contract/sample tasks T012-T013 can run in parallel before implementation.
- US2 validation sample tasks T022-T024 can run in parallel before detector changes.
- US3 evidence contract/sample tasks T032-T033 can run in parallel before report changes.
- Polish checks T040-T042 can run in parallel.

---

## Parallel Example: User Story 1

```text
Task: "Add encrypted export acceptance cases to specs/002-detector-precision-encryption/validation-samples.md"
Task: "Add manifest schema expectations for blocked and protected exports in specs/002-detector-precision-encryption/contracts/manifest.schema.json"
```

## Parallel Example: User Story 2

```text
Task: "Add false-positive controls in specs/002-detector-precision-encryption/validation-samples.md"
Task: "Add true-positive controls in specs/002-detector-precision-encryption/validation-samples.md"
Task: "Add detector precision validation result format to specs/002-detector-precision-encryption/contracts/detector-precision-contract.md"
```

## Parallel Example: User Story 3

```text
Task: "Add compliance evidence acceptance cases to specs/002-detector-precision-encryption/validation-samples.md"
Task: "Add report evidence expectations to specs/002-detector-precision-encryption/contracts/encrypted-export-contract.md"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for User Story 1.
3. Stop and validate that sensitive packages cannot be exported without password protection.

### Incremental Delivery

1. Deliver US1 encrypted export enforcement.
2. Deliver US2 detector precision tuning with synthetic validation.
3. Deliver US3 manifest/report evidence.
4. Run Phase 6 verification and update release notes.

### Quality Gates

- No production PII in validation materials.
- No server calls, uploads, telemetry, or remote storage.
- No unencrypted sensitive transport package.
- No federal cryptographic validation claim unless demonstrable.
- False-positive tuning must preserve true-positive detection.
