# Data Model: Detector Precision and Enforced Encryption

## DetectionFinding

Represents a potential PII item found in an input document.

**Fields**:

- `id`: Stable finding identifier within the review session.
- `file`: Source file name and relative path where available.
- `type`: PII category or candidate category.
- `matchPreview`: Masked or redacted preview safe for review.
- `rawValueAvailable`: Whether the original value remains available in browser memory for remediation.
- `context`: Nearby text or an unavailable-context reason.
- `contextSignals`: Positive and negative signals used to adjust confidence.
- `confidence`: Numeric score from 0 to 1.
- `severity`: `low`, `medium`, `high`, or `critical`.
- `confidenceReason`: User-visible explanation for confidence and downgrade/upgrade behavior.
- `policyBasis`: Policy or risk rationale associated with the finding.
- `disposition`: Current ReviewDisposition state.

**Validation Rules**:

- `confidence` must be between 0 and 1.
- `severity` must use the defined severity scale.
- Findings treated as false positives must retain original detection evidence, masked preview, context, and disposition timestamp.
- Findings with unresolved or suspected PII status must be treated as sensitive for export decisions.

## FalsePositiveControl

Represents a synthetic non-PII example used to verify detector precision.

**Fields**:

- `id`: Control identifier.
- `label`: Human-readable control name.
- `sampleText`: Synthetic text containing the value.
- `category`: Version, page, policy, section, actuarial, date, dollar, code, directive, or other non-PII category.
- `expectedOutcome`: Suppressed, downgraded, or shown as ambiguous with explanation.
- `disallowedOutcome`: High-confidence PII unless nearby context supports PII.
- `reason`: Why the example should not be treated as high-confidence PII.

**Validation Rules**:

- Controls must not use production PII.
- Each precision category in the spec must have at least one control.
- Validation must record whether each control met its expected outcome.

## TruePositiveControl

Represents a synthetic PII example used to verify that tuning does not suppress real PII.

**Fields**:

- `id`: Control identifier.
- `label`: Human-readable control name.
- `sampleText`: Synthetic text containing fake PII.
- `piiType`: Expected PII category.
- `expectedMinimumSeverity`: Minimum severity expected.
- `expectedMinimumConfidence`: Minimum confidence expected.
- `reason`: Why the example is PII in PBGC context.

**Validation Rules**:

- Controls must use fake, clearly synthetic personal data.
- Each high-priority PII category in the spec must have at least one control.
- Validation must record missed detections and severity/confidence regressions.

## ReviewDisposition

Represents a user decision for a finding.

**Fields**:

- `action`: `retain`, `redact`, `erase`, `false_positive`, or `unresolved`.
- `timestamp`: Date and time the decision was made.
- `reviewerNote`: Optional user note.
- `destructiveConfirmed`: Whether a redact or erase action was explicitly confirmed.
- `exportSensitive`: Whether the disposition still leaves sensitive data or reconstructable context in reports.

**State Transitions**:

- Initial finding state is `unresolved`.
- User may change `unresolved` to `retain`, `redact`, `erase`, or `false_positive`.
- Destructive actions require confirmation before export applies them.
- Any action may be changed before final export; reports must preserve the final action and original finding evidence.

## EncryptionEnforcementRecord

Represents evidence that sensitive transport protection was required and applied or blocked.

**Fields**:

- `passwordRequired`: Whether sensitive output required password protection.
- `passwordAccepted`: Whether the supplied password passed acceptance rules: at least 12 characters and at least three of uppercase letters, lowercase letters, numbers, and symbols.
- `exportBlocked`: Whether export was blocked.
- `blockedReason`: Reason export was blocked, if applicable.
- `archiveName`: Protected archive name, if produced.
- `passwordProtected`: Whether the produced package is password-protected.
- `encryptionStatus`: `not_required`, `protected`, `blocked`, or `limited`.
- `validationClaim`: Statement distinguishing password protection from federal cryptographic validation.
- `limitations`: User-visible limitations.

**Validation Rules**:

- If confirmed, suspected, or unresolved PII is present, `passwordRequired` must be true.
- If `passwordRequired` is true and `passwordProtected` is false, `exportBlocked` must be true.
- `validationClaim` must not claim formal validation unless demonstrable.

## ExportManifest

Represents the machine-readable evidence package generated with review output.

**Fields**:

- `tool`: Product name.
- `version`: App/release version.
- `feature`: Feature identifier for detector precision/encryption behavior.
- `generatedAt`: Export timestamp.
- `sourceFiles`: Input file metadata.
- `summary`: Counts for files, findings, severity, unresolved items, false positives, and encrypted export status.
- `policyReferences`: PBGC and federal policy references.
- `detectorValidation`: Summary of synthetic precision and recall checks used for the release.
- `findings`: DetectionFinding records with final dispositions.
- `encryption`: EncryptionEnforcementRecord.
- `limitations`: Browser, file conversion, encryption validation, or input format limitations.

**Validation Rules**:

- Every export must include `version`, `generatedAt`, `policyReferences`, `findings`, `encryption`, and `limitations`.
- Sensitive packages must show `encryption.encryptionStatus` as `protected`; otherwise export must be blocked and no sensitive package produced.
- Manifest evidence must be sufficient for downstream modules to understand detector version, policy basis, and transport status.
