# Contract: Encrypted Export Enforcement

## Purpose

Define the user-visible and manifest-visible behavior required before a transportable output package can be produced.

## Sensitive Export Decision

A package is sensitive when any of these are true:

- At least one finding is confirmed PII.
- At least one finding is suspected PII.
- At least one finding remains unresolved.
- A report, manifest, context snippet, redacted output, or downstream artifact can reconstruct PII.

## Required Behavior

- Sensitive export requires a user-selected password.
- Blank passwords are rejected.
- Password confirmation mismatch is rejected.
- Passwords below the configured acceptance rule are rejected.
- If password-protected archive creation is unavailable, sensitive package export is blocked.
- The app must not produce an unencrypted sensitive transport package.
- The app must show a clear status explaining protected, blocked, not required, or limited export.

## Manifest Evidence

The manifest must include:

- `passwordRequired`
- `passwordAccepted`
- `passwordProtected`
- `exportBlocked`
- `blockedReason`
- `encryptionStatus`
- `validationClaim`
- `limitations`
- `createdAt`
- `toolVersion`

## Acceptance Checks

1. Given confirmed PII and no password, export is blocked.
2. Given unresolved findings and no password, export is blocked.
3. Given confirmed PII and a valid password, the archive is password-protected and the manifest records `encryptionStatus: "protected"`.
4. Given encryption capability is unavailable, sensitive package export is blocked and the manifest/status records the limitation.
5. Given no findings and no sensitive report content, export may proceed with `passwordRequired: false`.
