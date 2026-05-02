# Feature Specification: Detector Precision and Enforced Encryption

**Feature Branch**: `002-detector-precision-encryption`  
**Created**: 2026-05-02  
**Status**: Draft  
**Input**: User description: "PBGC actuaries must comply with current PII regulations and transport sensitive information safely. Federal laws apply. Encryption with passwords must be enforced. Improve detector precision so obvious non-PII values are not reported as PII while preserving true PII detection."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prevent Unencrypted Transport (Priority: P1)

As a PBGC actuary preparing reviewed PII findings for downstream analysis, I need every transportable output package that contains or references PII to require password encryption so sensitive information is not carried by email or removable media in unprotected form.

**Why this priority**: Enforced encryption is the primary safeguard for transport of sensitive information and is central to PBGC PII handling responsibilities.

**Independent Test**: Process a document with confirmed PII, complete review actions, attempt to export a transport package without a password, and verify that no transportable package is produced until a valid password is supplied.

**Acceptance Scenarios**:

1. **Given** reviewed findings include confirmed or unresolved PII, **When** the user attempts to export a transport package without a password, **Then** the app blocks the export and explains that encrypted transport is required.
2. **Given** reviewed findings include confirmed or unresolved PII, **When** the user supplies an acceptable password and exports, **Then** the generated transport package is password-protected and the manifest records encryption enforcement evidence.
3. **Given** the app cannot provide password-protected export in the current browser session, **When** the user attempts to export a transport package containing PII, **Then** the app prevents unencrypted transport and records a clear limitation instead of silently creating an unprotected package.

---

### User Story 2 - Reduce Obvious False Positives (Priority: P2)

As a PBGC actuary reviewing findings, I need numeric versions, policy references, page labels, codes, dates, actuarial values, and ordinary financial figures to be separated from likely PII so I can focus on real privacy risk.

**Why this priority**: Excess false positives slow review, reduce trust in the tool, and can cause users to miss real findings among noise.

**Independent Test**: Process a synthetic document containing known non-PII numeric values and known true PII controls, then verify that non-PII items are suppressed or downgraded while true PII remains visible.

**Acceptance Scenarios**:

1. **Given** a document includes values such as policy numbers, directive numbers, section labels, version strings, page numbers, actuarial rates, dollar amounts, and ordinary dates, **When** detection runs, **Then** those values are not presented as high-confidence PII unless nearby context supports a PII interpretation.
2. **Given** a document includes true PII such as SSN, taxpayer identifiers, participant names with identifiers, addresses, phone numbers, email addresses, dates of birth, and benefit records tied to a person, **When** detection runs, **Then** those findings remain visible with severity and context.
3. **Given** a value could be either PII or non-PII depending on context, **When** detection runs, **Then** the finding includes a confidence explanation that helps the user decide whether to retain, redact, erase, or mark as false positive.

---

### User Story 3 - Preserve Compliance Evidence (Priority: P3)

As a PBGC actuary or reviewer, I need the output manifest and reports to show how the app handled detection, severity, disposition, and encryption enforcement so that the work can be reviewed against PBGC privacy obligations.

**Why this priority**: Audit evidence is needed to support responsible PII handling and to prepare output for downstream modules or authorized analysis.

**Independent Test**: Complete a review session, export with a password, and verify that reports include policy references, severity/confidence decisions, user dispositions, encryption status, limitations, and version metadata.

**Acceptance Scenarios**:

1. **Given** the user completes review actions, **When** reports are generated, **Then** every finding has severity, confidence, context, disposition, and reviewer action evidence.
2. **Given** a package is exported, **When** the manifest is inspected, **Then** it records that password encryption was required, whether encryption succeeded, any validation limitations, and the feature/app version.
3. **Given** a user marks an item as false positive, **When** reports are generated, **Then** that disposition remains auditable and does not remove the original detection record from the review evidence.

### Edge Cases

- A document has no detected PII: export may proceed without sensitive transport content, but the manifest must still state that no PII was detected and no sensitive package encryption was required.
- A user attempts to use a blank, too-short, or confirmation-mismatched password: export must be blocked until the password is acceptable.
- A browser or runtime limitation prevents encryption: the app must block transport package creation for sensitive output and tell the user what was not produced.
- A value appears in conflicting contexts, such as "Plan 123-45-6789" versus "SSN 123-45-6789": the app must use context to downgrade or elevate the finding and explain the distinction.
- Redaction, erasure, or false-positive actions are incomplete: export must show unresolved items and must not imply that all PII was disposed of.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST require password-protected export for any transportable output package that contains, references, or can reconstruct confirmed, suspected, or unresolved PII.
- **FR-002**: The app MUST block sensitive package export when no password is supplied, the password is blank, the password is fewer than 12 characters, the password does not include at least three of uppercase letters, lowercase letters, numbers, and symbols, or password confirmation does not match.
- **FR-003**: The app MUST prevent unencrypted transport packages for sensitive output when password protection is unavailable, and MUST present a clear limitation instead of creating an unprotected package.
- **FR-004**: The app MUST record encryption enforcement evidence in the export manifest, including password-required status, encryption result, user-visible limitations, export timestamp, and version metadata.
- **FR-005**: The app MUST avoid claiming federal cryptographic validation unless that validation can be demonstrated for the actual export mechanism; otherwise, the manifest MUST state the validation limitation.
- **FR-006**: The app MUST reduce obvious false positives for numeric and formatted values that commonly appear in PBGC actuarial, policy, regulatory, reporting, and document-control material without representing a person.
- **FR-007**: The app MUST preserve high-priority detection for true PII categories relevant to PBGC work, including SSN, taxpayer identifiers, participant or beneficiary names tied to identifiers, addresses, phone numbers, email addresses, dates of birth, bank/payment data, and benefit records tied to a person.
- **FR-008**: The app MUST use nearby document context to adjust finding confidence and severity when a value can resemble either PII or non-PII.
- **FR-009**: The app MUST provide a user-visible reason or evidence snippet for confidence downgrades, severity upgrades, false-positive treatment, and ambiguous findings.
- **FR-010**: The app MUST include a synthetic validation set containing known true PII controls and known non-PII controls such as directive numbers, version numbers, page numbers, dates, actuarial rates, monetary values, plan codes, policy citations, and section references.
- **FR-011**: The app MUST report detection, severity, confidence, remediation action, and final disposition for each finding without overwriting the original finding record.
- **FR-012**: The app MUST preserve browser-only processing with no server calls unless PBGC governance explicitly changes that constraint.
- **FR-PBGC-001**: The app MUST identify PBGC IM 05-09 and IM 10-03 obligations affected by detection, handling, reporting, remediation, disposal, and transport of PII.
- **FR-PBGC-002**: The app MUST support PBGC privacy review by mapping reports to policy concerns for safeguarding PII, breach risk reduction, minimization, disposition evidence, and controlled transport.
- **FR-PBGC-003**: The app MUST treat federal privacy and information-security obligations as governing constraints for sensitive output, including the Privacy Act, E-Government Act privacy impact expectations, OMB breach-response guidance, NIST privacy/security controls, and PBGC directives.

### Key Entities *(include if feature involves data)*

- **Detection Finding**: A potential PII item with category, matched value or redacted preview, location, context, confidence, severity, policy relevance, and current disposition.
- **False-Positive Control**: A known non-PII pattern or example used to verify that the detector does not over-report ordinary PBGC actuarial, policy, regulatory, or document-control values.
- **Encryption Enforcement Record**: Manifest evidence showing whether sensitive export required a password, whether protected export succeeded, and what limitations were disclosed.
- **Review Disposition**: The user decision for a finding, including `retain`, `redact`, `erase`, `false_positive`, `unresolved`, timestamp, and evidence needed for audit review.
- **Policy Mapping**: A report section that connects app behavior and user decisions to PBGC privacy directives and relevant federal privacy/security obligations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of transportable packages containing confirmed, suspected, or unresolved PII are blocked unless password protection is successfully applied.
- **SC-002**: 0 unencrypted sensitive transport packages are produced in validation testing when PII findings are present.
- **SC-003**: Synthetic false-positive controls for version, page, policy, section, actuarial, date, dollar, and code-like values are suppressed or downgraded at least 90% of the time without user action.
- **SC-004**: Synthetic true-positive controls for SSN, taxpayer identifiers, participant identifiers, contact information, birth dates, payment data, and person-tied benefit records remain detected at least 95% of the time.
- **SC-005**: At least 95% of ambiguous findings include a user-visible context or confidence explanation sufficient for reviewer disposition.
- **SC-006**: 100% of exports include manifest evidence for encryption enforcement, version metadata, policy references, and any validation limitations.
- **SC-007**: A reviewer can complete disposition and protected export for a 25-finding sample in under 10 minutes without needing a separate tool for encryption.

## Assumptions

- Target users are PBGC actuaries and authorized reviewers handling PBGC business documents that may contain PII.
- The app supports compliance workflow and evidence generation but does not replace official PBGC privacy officer, legal, records, or security determinations.
- Current PBGC directives and federal requirements are treated as governing references; implementation must not claim certification or legal compliance beyond what the app can demonstrate.
- Password-protected transport is mandatory for sensitive output, even if the user has marked some findings as remediated, when reports or manifests still contain sensitive values or enough context to reconstruct them.
- Existing single-page, local-only operation remains in scope.

## PBGC Privacy and Runtime Constraints *(mandatory)*

- Policy basis: PBGC IM 05-09 Privacy Program; PBGC IM 10-03 Protecting Personally Identifiable Information; Privacy Act of 1974; E-Government Act privacy obligations; OMB M-17-12 breach-response guidance; NIST SP 800-53 security and privacy control expectations; applicable federal information-security obligations.
- PII data handling: PII remains local to the user-controlled browser session; detection and review minimize exposure by showing only the needed context and by preserving disposition evidence.
- Remediation evidence: `retain`, `redact`, `erase`, `false_positive`, and `unresolved` decisions are recorded per finding with severity, confidence, context, and reviewer action evidence.
- Export constraints: Sensitive transport packages require password protection; unencrypted sensitive packages are blocked; manifests must identify encryption status, password enforcement, policy references, version metadata, and any cryptographic validation limitation.
- Versioning: The feature must update project version metadata, changelog/release notes, and report manifests so downstream modules can identify the detector rules and encryption enforcement behavior used.
