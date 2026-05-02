# Research: Detector Precision and Enforced Encryption

## Decision: Enforce Password-Protected Transport for Sensitive Packages

Password-protected export is mandatory whenever the package contains, references, or can reconstruct confirmed, suspected, or unresolved PII. If the browser session cannot create a password-protected archive, the app must block sensitive package export and present a limitation.

**Rationale**: The project exists to support PBGC actuaries handling sensitive PII. Optional encryption leaves too much room for accidental unprotected email or removable-media transport. Blocking unprotected export is the simplest auditable control.

**Alternatives considered**:

- Allow unencrypted export with a warning: rejected because it does not enforce the user requirement or the privacy purpose of the project.
- Export local-only files without an archive: allowed only when no sensitive transport package is created and the manifest clearly states the limitation.
- Require a separate external encryption tool: rejected for this feature because success criteria require protected export without a separate tool.

## Decision: Do Not Claim Federal Cryptographic Validation Unless Proven

The manifest must distinguish password protection from formal federal cryptographic validation. If the browser/library path is not demonstrably validated for the applicable FIPS standard, the app must disclose that limitation.

**Rationale**: PBGC IM 10-03 references FIPS 140-2 until 2026 and FIPS 140-3 thereafter. Browser-based archive encryption can be useful for transport protection, but the app must not overstate compliance if the actual encryption path is not validated.

**Alternatives considered**:

- Claim compliance because the archive is password-protected: rejected because password protection and FIPS validation are different claims.
- Remove archive encryption until formal validation exists: rejected because enforced password protection still materially reduces transport risk when accurately disclosed.

## Decision: Use Contextual Downgrades Rather Than Silent Suppression

Obvious non-PII values should be suppressed from high-confidence review or downgraded with a reason, while material findings remain auditable through validation evidence and reports.

**Rationale**: The constitution requires false-positive controls to preserve auditability. Downgrade reasons also help actuaries understand why a value was treated as policy/document noise instead of PII.

**Alternatives considered**:

- Drop all likely false positives silently: rejected because it weakens auditability and makes rule behavior harder to review.
- Show every pattern match equally: rejected because excessive false positives slow review and reduce confidence in the detector.

## Decision: Add Synthetic Controls for Both False Positives and True Positives

Validation must include non-PII examples such as directive numbers, version strings, page labels, dates, actuarial rates, dollar amounts, plan codes, policy citations, and section references, plus true PII controls such as SSNs, taxpayer identifiers, person-tied contact information, and payment/benefit records.

**Rationale**: Precision improvements are risky unless true-positive recall is checked at the same time. A paired synthetic set makes regressions visible without using production PII.

**Alternatives considered**:

- Use production PBGC documents for validation: rejected unless formally authorized by PBGC policy.
- Validate only with false-positive examples: rejected because detector tuning could accidentally suppress real PII.

## Decision: Treat Unresolved Findings as Sensitive

Unresolved findings must force password-protected transport just like confirmed PII.

**Rationale**: An unresolved finding may still be PII. Transport controls should fail closed when sensitivity is uncertain.

**Alternatives considered**:

- Encrypt only findings marked redact or erase: rejected because reports and context can still expose suspected PII.
- Let the user override encryption for unresolved findings: rejected because password encryption is a hard requirement for sensitive transport.
