# PBGC Directive Policy Mapping

Source files read from repository root:

- `im-05-09.pdf`
- `im-10-03.pdf`

Text was extracted locally with `pdftotext -layout` and reviewed for PII definition, scope, encryption, dissemination, disposal, breach, training, and responsibility requirements.

## IM 05-09: PBGC Privacy Program

Relevant policy points for this app:

- The directive establishes PBGC's privacy program framework under the Privacy Act, OMB guidance, and NIST guidance.
- It applies to PBGC employees and contractors.
- PBGC requires employees and contractors to safeguard PII collected, maintained, used, and disseminated by PBGC.
- PII is information that can distinguish or trace an individual's identity alone, or when combined with linked or linkable information.
- PII includes information about participants and beneficiaries in covered pension plans, PBGC employees, and PBGC contractors.
- PBGC policy is to protect PII commensurate with the sensitivity, criticality, and value of the information.
- PBGC uses privacy risk management and NIST-aligned controls.
- Breach means loss of control, compromise, unauthorized disclosure/acquisition, or access/potential access by an unauthorized person or for an unauthorized purpose.
- Employees and contractors must follow PBGC privacy procedures when handling PII in electronic or paper format and assist in reporting, assessing, training, and improving PBGC PII handling.

App implications:

- The detector must treat participant/beneficiary, employee, and contractor identifiers as PBGC PII.
- Context matters because linkable information can become PII when combined with other data.
- Findings, disposition decisions, and exports must preserve audit evidence for privacy review.
- The app must not use production PII for validation materials.

## IM 10-03: Protecting Personally Identifiable Information

Relevant policy points for this app:

- The directive establishes policies and procedures for protecting PII.
- It applies to PBGC employees, contractors, other persons with access to PBGC business PII, PBGC IT systems/processes, and systems operated on behalf of PBGC that collect, process, maintain, use, share, disseminate, or dispose of PII.
- PII must be protected from loss, misuse, unauthorized access, modification, unauthorized disclosure, and unauthorized acquisition.
- PII determination requires assessing the specific risk that an individual can be identified using linked or linkable information.
- A PIA analyzes how PII is or will be handled to ensure legal/policy conformity and assess privacy risks and protections.
- PBGC policy requires encrypting PII stored on PBGC-issued IT equipment, contractor IT equipment, and removable media.
- Production PII must not be used for release development, release testing, training, or production support; synthetic data must be used unless an approved policy deviation exists.
- PII may be collected, maintained, and disseminated only when necessary for a PBGC business need.
- PII must be used only in a way compatible with the purpose for which it was collected.
- Access to PII is limited to people with a need to know.
- Removal of PII from PBGC IT devices/network, contractor devices/network, or the workplace requires approval from the Chief Privacy Officer for PII.
- PII stored electronically must be accessed only across a secure PBGC connection.
- PII disseminated outside PBGC must be required and, when electronic, must use a PBGC-approved data encryption method or secure file transfer application.
- Electronic media and paper documents containing PII must be disposed of when no longer needed in accordance with PBGC records and CUI directives.
- Employees and contractors must immediately report suspected or confirmed breaches using PBGC reporting channels.

App implications:

- Password-protected zip export is a local transport safeguard, not proof of PBGC-approved external dissemination.
- The app must warn users not to email/export PII outside PBGC unless required and using PBGC-approved encryption or secure file transfer.
- The app must record that removal/dissemination approval and PBGC transfer method are outside the static app's authority.
- Export manifests must disclose encryption limitations and not claim FIPS or PBGC approval unless independently validated/approved.
- Disposal/redaction actions must be documented as review/export actions and must not replace official PBGC records management or CUI disposal procedures.
- Redacted outputs should preserve non-PII surrounding text for OCR/LLM analysis and replace only sensitive values with neutral placeholders such as `[REDACTED]` or `[ERASED]`.
