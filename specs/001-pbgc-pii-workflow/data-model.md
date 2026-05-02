# Data Model: PBGC PII Detection Workflow

## InputDocument

Represents one user-selected file.

**Fields**

- `id`: Stable review-session identifier.
- `name`: Display filename.
- `relativePath`: Directory-relative path when available; otherwise filename.
- `size`: File size in bytes.
- `mimeType`: Browser-reported type or `unknown`.
- `extension`: Lowercase file extension.
- `status`: `queued`, `processing`, `processed`, `skipped`, or `error`.
- `extractedTextAvailable`: Boolean.
- `conversionLimitations`: List of limitations encountered during reading or export.

**Validation Rules**

- `relativePath` must be present for reporting.
- Unsupported or unreadable files must be represented with `status` and limitation text rather
  than disappearing from the review.

## ExtractedDocument

Represents text and metadata derived from an input document.

**Fields**

- `documentId`: References `InputDocument`.
- `text`: Extracted text retained only during the browser session.
- `pageCount`: Page count when available.
- `extractionWarnings`: Non-fatal warnings.

**Validation Rules**

- PII-bearing extracted text must not be sent outside the browser.
- Empty extraction is allowed but must be reported.

## PIIFinding

Represents one detected occurrence.

**Fields**

- `id`: Stable finding identifier.
- `documentId`: References `InputDocument`.
- `file`: Display path for the source document.
- `type`: PII category, such as SSN, email, phone, address, financial identifier, tax identifier,
  credential, or technical secret.
- `match`: Raw value retained only for review and redaction within the browser session.
- `masked`: Masked value for reports.
- `context`: Nearby text with the finding marked.
- `location`: Offset, page, row, or unavailable reason.
- `confidence`: Decimal confidence between 0 and 1.
- `severity`: `low`, `medium`, `high`, or `critical`.
- `policyBasis`: PBGC policy rationale.
- `disposition`: References `DispositionDecision`.

**Validation Rules**

- Every finding must include `type`, `confidence`, `severity`, `context` or unavailable reason, and
  `policyBasis`.
- Raw values must be excluded from exports unless the user explicitly chooses a retention path that
  requires them.

## SeverityRating

Represents the risk valuation for a finding.

**Fields**

- `level`: `low`, `medium`, `high`, or `critical`.
- `score`: Numeric ordering value for sorting.
- `rationale`: Human-readable reason for the level.

**Validation Rules**

- Levels must sort from critical to low.
- Critical and high findings default to action-oriented dispositions.

## DispositionDecision

Represents the user's management decision for a finding.

**Fields**

- `findingId`: References `PIIFinding`.
- `action`: `retain`, `redact`, `erase`, or `needs_review`.
- `decidedAt`: Timestamp when assigned or changed.
- `decisionSource`: `default` or `user`.
- `notes`: Optional reviewer note.

**State Transitions**

- Initial state: `needs_review`, `redact`, or another default based on severity.
- User may change to any valid action.
- Export preserves the current action for every finding.

## ExportPackage

Represents the exported review output.

**Fields**

- `toolName`: Product name.
- `toolVersion`: Release version.
- `createdAt`: Export timestamp.
- `policyReferences`: PBGC policy references.
- `sourceFiles`: List of `InputDocument` summaries.
- `findings`: Masked `PIIFinding` records with dispositions.
- `outputs`: Inventory of report, manifest, redacted text, PDF renditions, and archive files.
- `archive`: Archive name, password-protection status, and limitations.
- `limitations`: Known processing and browser limitations.

**Validation Rules**

- Manifest must be included in every export.
- Archive status must not claim password protection unless it was actually used.
- Exports with unresolved findings must mark them as `needs_review`.

## WorkflowTask

Represents the user-visible privacy handling workflow.

**Fields**

- `name`: One of detect, report, value severity, manage, dispose/redact.
- `description`: Plain-language task description.
- `status`: `not_started`, `active`, `complete`, or `needs_attention`.

**Validation Rules**

- All five tasks must be visible in the workflow panel.
- The workflow panel must remain accessible after dismissal.
