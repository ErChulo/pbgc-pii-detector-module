# Validation Samples: Detector Precision and Enforced Encryption

Use synthetic data only. These samples support the quickstart and implementation tasks for feature `002-detector-precision-encryption`.

## False-Positive Controls

| ID | Category | Sample | Expected Outcome |
|----|----------|--------|------------------|
| FP-001 | Directive | `PBGC IM 10-03 is referenced for this workflow.` | Not high-confidence PII |
| FP-002 | Version | `The current release is v0.4.0.` | Not high-confidence PII |
| FP-003 | Page | `See page 12 for the policy summary.` | Not high-confidence PII |
| FP-004 | Section | `Review section 5.2 before export.` | Not high-confidence PII |
| FP-005 | Date | `The report was prepared on 05/02/2026.` | Not high-confidence PII |
| FP-006 | Dollar | `The plan liability is $1,250,000.` | Not high-confidence PII |
| FP-007 | Rate | `The actuarial rate is 5.75%.` | Not high-confidence PII |
| FP-008 | Plan Code | `Plan 123-45-6789 requires actuarial review.` | Downgraded or ambiguous, not high confidence |
| FP-009 | Citation | `5 U.S.C. 552a applies to Privacy Act records.` | Not high-confidence PII |

## True-Positive Controls

| ID | Category | Sample | Expected Outcome |
|----|----------|--------|------------------|
| TP-001 | SSN | `SSN 123-45-6789 belongs to Jane Example.` | Detected as critical or high PII |
| TP-002 | Taxpayer ID | `Taxpayer ID 12-3456789 is associated with Jane Example.` | Detected as high PII |
| TP-003 | Participant Identifier | `Participant Jane Example, SSN 123-45-6789, has a benefit record.` | Detected as PII |
| TP-004 | Address | `Jane Example lives at 100 Main Street.` | Detected as PII |
| TP-005 | Phone | `Jane Example phone: 202-555-0199.` | Detected as PII |
| TP-006 | Email | `Jane Example email: jane.example@example.gov.` | Detected as PII |
| TP-007 | DOB | `DOB 01/15/1960 for Jane Example.` | Detected as high PII |
| TP-008 | Payment | `Jane Example bank routing 021000021 and account 123456789012.` | Detected as financial PII |
| TP-009 | Benefit | `Jane Example receives monthly benefit $1,234.56 tied to SSN 123-45-6789.` | Detected as person-tied benefit PII |

## Encrypted Export Acceptance Cases

| ID | Scenario | Expected Outcome |
|----|----------|------------------|
| EE-001 | Confirmed PII and no password | Export blocked |
| EE-002 | Unresolved finding and no password | Export blocked |
| EE-003 | Password under 12 characters | Export blocked |
| EE-004 | Password missing three character classes | Export blocked |
| EE-005 | Password confirmation mismatch | Export blocked |
| EE-006 | Valid password and zip support | Protected archive created |
| EE-007 | Sensitive output and zip support unavailable | Sensitive package export blocked |
| EE-008 | No findings and no sensitive report content | Export allowed with password not required |

## Compliance Evidence Acceptance Cases

| ID | Evidence | Expected Outcome |
|----|----------|------------------|
| CE-001 | Manifest policy references | Includes PBGC IM 05-09, PBGC IM 10-03, Privacy Act, OMB M-17-12, NIST SP 800-53 |
| CE-002 | Manifest encryption record | Includes password requirement, protected/blocked status, and validation claim |
| CE-003 | JSON report | Includes confidence reason, context signals, disposition timestamp, and false-positive status |
| CE-004 | CSV report | Includes confidence reason and encryption status fields |
| CE-005 | HTML report | Includes compliance evidence and encryption summary sections |

## Final Validation Notes

- Implemented static validation controls in `pii-detection.v0.4.0/src/main.js`.
- `npm.cmd run build` passed after installing local Vite dependencies.
- Manifest schema JSON parses successfully.
- Source scan found no `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, or remote storage usage in `pii-detection.v0.4.0/src/main.js`; the only URL in that file is the existing pdf.js worker CDN reference.
- Browser quickstart validation and the 25-finding timed review/export flow still require an interactive browser run.
