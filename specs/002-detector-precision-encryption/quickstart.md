# Quickstart: Detector Precision and Enforced Encryption

## Prerequisites

- Use synthetic data only.
- Open `pii-detection.v0.4.0/index.html` directly in a modern desktop browser.
- Do not use production PBGC PII unless a documented PBGC policy deviation authorizes it.

## Manual Validation Flow

1. Open `pii-detection.v0.4.0/index.html`.
2. Confirm the app loads without a dev server.
3. Create or select a synthetic text file containing obvious non-PII controls:
   - `IM 10-03`
   - `v0.4.0`
   - `page 12`
   - `section 5.2`
   - `$1,250,000`
   - `5.75%`
   - `Plan 123-45-6789`
4. Add synthetic true-positive controls:
   - `SSN 123-45-6789`
   - `DOB 01/15/1960`
   - `Participant Jane Example, SSN 123-45-6789`
   - `jane.example@example.gov`
   - `202-555-0199`
5. Process the file.
6. Verify ordinary policy, version, page, section, dollar, actuarial, and plan-code values are suppressed, downgraded, or shown as ambiguous rather than high-confidence PII.
7. Verify synthetic true PII remains detected with severity, confidence, context, and policy basis.
8. Mark at least one item as false positive, one as redact, and leave one unresolved.
9. Attempt export without a password.
10. Verify sensitive export is blocked.
11. Enter a valid password and confirm it.
12. Export the package.
13. Inspect the manifest and report outputs.

## Expected Results

- No server, upload, telemetry, or remote storage behavior occurs.
- Source scan of `pii-detection.v0.4.0/src/main.js` shows no `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, or remote storage paths.
- Sensitive export without a password is blocked.
- Unresolved findings force password-protected export.
- The manifest records password requirement, password-protected status, encryption limitations, policy references, version metadata, and detector behavior.
- The app does not claim formal federal cryptographic validation unless the implementation can prove it.
- False-positive dispositions retain audit evidence.

## Optional Development Checks

From `pii-detection.v0.4.0`:

```powershell
npm.cmd run build
```

The build check is optional development verification only. Runtime operation must remain direct browser use of `index.html`.
