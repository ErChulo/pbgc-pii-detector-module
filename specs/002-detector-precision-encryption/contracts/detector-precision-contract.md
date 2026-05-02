# Contract: Detector Precision Validation

## Purpose

Define the validation expectations for reducing obvious false positives while preserving true PII detection.

## False-Positive Control Categories

The validation set must include synthetic examples for:

- Directive and policy numbers.
- Version strings.
- Page labels and section numbers.
- Ordinary dates.
- Actuarial rates and percentages.
- Dollar amounts.
- Plan, form, case, or document-control codes.
- Regulatory citations.

## True-Positive Control Categories

The validation set must include synthetic examples for:

- SSNs.
- Taxpayer identifiers.
- Participant or beneficiary identifiers.
- Names tied to identifiers.
- Addresses.
- Phone numbers.
- Email addresses.
- Dates of birth.
- Bank or payment data.
- Benefit records tied to a person.

## Required Outcomes

- At least 90% of false-positive controls are suppressed or downgraded without user action.
- At least 95% of true-positive controls remain detected.
- Ambiguous findings include a context or confidence explanation.
- Downgraded findings do not erase audit evidence.
- Severity is not reduced for direct identifiers solely because numeric formatting resembles non-PII.

## Regression Report Fields

Each validation run should record:

- `controlId`
- `controlCategory`
- `expectedOutcome`
- `actualOutcome`
- `confidence`
- `severity`
- `explanation`
- `passed`

The manifest `detectorValidation.controls` array should use the same fields so
downstream reviewers can compare expected and actual detector behavior.

## Acceptance Checks

1. `IM 10-03`, `v0.4.0`, `page 12`, `section 5.2`, `$1,250,000`, and `5.75%` are not high-confidence PII without person-identifying context.
2. `SSN 123-45-6789`, `DOB 01/15/1960`, and `Participant Jane Example, 123-45-6789` remain detected as PII using synthetic values only.
3. `Plan 123-45-6789` is downgraded or shown as ambiguous, while `SSN 123-45-6789` remains high confidence.
4. Reports explain why a candidate was downgraded, suppressed, ambiguous, or elevated.
