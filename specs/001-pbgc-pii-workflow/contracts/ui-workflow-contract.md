# UI Workflow Contract: PBGC PII Detection Workflow

## Intake

- User can select one or more local files.
- User can select a local directory when browser support is available.
- User can drag and drop files into the intake area.
- Unsupported files are skipped with visible status rather than silently ignored.

## Workflow Panel

The panel must show these tasks in order:

1. Detect in context.
2. Report findings.
3. Value severity.
4. Manage decisions.
5. Dispose, erase, or redact.

The panel must include PBGC IM 05-09 and IM 10-03 policy basis and remain reopenable.

## Findings Review

Each finding row must expose:

- Source file identity.
- PII type.
- Severity level.
- Confidence.
- Context or unavailable-context reason.
- Policy basis.
- Disposition selector with retain, redact, erase, and needs review.

## Summary

The main review screen must show:

- Number of queued or processed files.
- Total findings.
- High or critical findings.
- Findings that still need review.

## Export

Export controls must allow:

- User-selected password input for archive packaging.
- User-selected output directory when browser support is available.
- Download fallback when directory writing is unavailable.
- Clear status message describing whether password protection was applied.

## Error and Limitation Messaging

The app must report:

- Corrupted, unreadable, unsupported, or password-protected input files.
- PDF conversion limitations.
- Directory write limitations.
- Archive password-protection limitations.
