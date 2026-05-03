const VERSION = "0.4.0";
const FEATURE_ID = "002-detector-precision-encryption";
const OUTPUT_DIR = "pii-output-v0.4.0";
const CUSTOM_REGEX_DB = "pbgc-pii-detector";
const CUSTOM_REGEX_STORE = "customRegexTests";
const VALIDATION_CLAIM = "Password-protected archive export is enforced as a local safeguard. IM 10-03 still requires PBGC-approved encryption or secure file transfer for electronic dissemination outside PBGC; this browser/library path is not claimed as FIPS 140-3 validated or PBGC-approved unless independently validated and approved.";
const POLICY_REFERENCES = [
  "PBGC IM 05-09 Privacy Program",
  "PBGC IM 10-03 Protecting Personally Identifiable Information",
  "Privacy Act of 1974, 5 U.S.C. 552a",
  "OMB M-17-12 Preparing for and Responding to a Breach of Personally Identifiable Information",
  "NIST SP 800-53 Rev. 5 Security and Privacy Controls"
];
const POLICY_OBLIGATIONS = [
  "IM 05-09: protect PII commensurate with sensitivity, criticality, and value; PII includes participant, beneficiary, employee, and contractor information.",
  "IM 05-09 and IM 10-03: PII includes information that identifies a person alone or when combined with linked or linkable information.",
  "IM 10-03: use synthetic data for release testing, training, and production support unless an approved policy deviation exists.",
  "IM 10-03: collect, maintain, and disseminate PII only for a PBGC business need and only with need-to-know access.",
  "IM 10-03: removal of PII from PBGC or contractor devices, networks, or the workplace requires Chief Privacy Officer approval for PII.",
  "IM 10-03: electronic dissemination of PII outside PBGC must be required and use a PBGC-approved data encryption method or secure file transfer application.",
  "IM 10-03: dispose of electronic media and paper documents containing PII when no longer needed according to PBGC records and CUI directives.",
  "IM 05-09 and IM 10-03: suspected or confirmed breaches must be reported through PBGC breach/incident reporting processes."
];

const DISPOSITIONS = {
  retain: "retain",
  redact: "redact",
  erase: "erase",
  falsePositive: "false_positive",
  unresolved: "unresolved"
};

const ENCRYPTION_STATUS = {
  notRequired: "not_required",
  protected: "protected",
  blocked: "blocked",
  limited: "limited"
};

const severityRank = { low: 1, medium: 2, high: 3, critical: 4 };

const detectors = [
  {
    type: "PBGC_DIRECTIVE_REFERENCE",
    regex: /\b(?:PBGC\s+)?IM\s+\d{2}-\d{2}\b/gi,
    severity: "low",
    confidence: 0.2,
    policy: "PBGC directive reference; recorded as non-PII false-positive control",
    falsePositive: true
  },
  {
    type: "VERSION_REFERENCE",
    regex: /\bv\d+\.\d+\.\d+\b/gi,
    severity: "low",
    confidence: 0.2,
    policy: "Version reference; recorded as non-PII false-positive control",
    falsePositive: true
  },
  {
    type: "PAGE_OR_SECTION_REFERENCE",
    regex: /\b(?:page|section)\s+\d+(?:\.\d+)?\b/gi,
    severity: "low",
    confidence: 0.2,
    policy: "Page or section reference; recorded as non-PII false-positive control",
    falsePositive: true
  },
  {
    type: "ACTUARIAL_VALUE",
    regex: /\$[\d,]+(?:\.\d{2})?\b|\b\d+(?:\.\d+)?%\b/g,
    severity: "low",
    confidence: 0.2,
    policy: "Actuarial, dollar, or rate value; recorded as non-PII false-positive control",
    falsePositive: true
  },
  {
    type: "REGULATORY_CITATION",
    regex: /\b\d+\s+U\.S\.C\.\s+\d+[a-z]?\b|\b\d+\s+C\.F\.R\.\s+\d+(?:\.\d+)?\b/gi,
    severity: "low",
    confidence: 0.2,
    policy: "Regulatory citation; recorded as non-PII false-positive control",
    falsePositive: true
  },
  {
    type: "SSN",
    regex: /\b(?!000|666|9\d{2})\d{3}[- ]?\d{2}[- ]?\d{4}\b/g,
    severity: "critical",
    confidence: 0.95,
    policy: "Direct identifier under PBGC IM 05-09 and IM 10-03"
  },
  {
    type: "EIN_OR_ROUTING",
    regex: /\b\d{2}-\d{7}\b|\b\d{9}\b/g,
    severity: "high",
    confidence: 0.7,
    policy: "Financial or organizational identifier requiring contextual review"
  },
  {
    type: "BANK_ACCOUNT_CONTEXT",
    regex: /\b(?:account|acct|bank account|payment account)[:\s#-]*\d{6,17}\b/gi,
    severity: "critical",
    confidence: 0.88,
    policy: "Bank or payment data requiring strong safeguards"
  },
  {
    type: "EMAIL",
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    severity: "medium",
    confidence: 0.9,
    policy: "Linkable identifier under PBGC privacy policy"
  },
  {
    type: "PHONE",
    regex: /\b(?:\+?1[-.\s]*)?\(?[2-9]\d{2}\)?[-.\s]*\d{3}[-.\s]*\d{4}\b/g,
    severity: "medium",
    confidence: 0.85,
    policy: "Linkable contact identifier"
  },
  {
    type: "CREDIT_CARD",
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    severity: "critical",
    confidence: 0.9,
    policy: "Financial account data requiring strong safeguards"
  },
  {
    type: "DOB",
    regex: /\b(?:DOB|date of birth|birth date)[:\s-]*(?:0?[1-9]|1[0-2])[/-](?:0?[1-9]|[12]\d|3[01])[/-](?:19|20)\d{2}\b/gi,
    severity: "high",
    confidence: 0.8,
    policy: "Directly linkable personal attribute"
  },
  {
    type: "ADDRESS_CONTEXT",
    regex: /\b\d{1,6}\s+[A-Za-z0-9.' -]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Court|Ct)\b/gi,
    severity: "medium",
    confidence: 0.72,
    policy: "Linkable location information"
  },
  {
    type: "AWS_ACCESS_KEY",
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    severity: "critical",
    confidence: 0.98,
    policy: "Credential or technical secret"
  },
  {
    type: "GOOGLE_API_KEY",
    regex: /\bAIza[0-9A-Za-z_-]{35}\b/g,
    severity: "critical",
    confidence: 0.95,
    policy: "Credential or technical secret"
  },
  {
    type: "JWT",
    regex: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
    severity: "critical",
    confidence: 0.92,
    policy: "Credential or session token"
  },
  {
    type: "IP_ADDRESS",
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
    severity: "low",
    confidence: 0.75,
    policy: "Technical identifier; severity may increase with other context"
  }
];

const piiPositiveTerms = [
  "ssn",
  "social security",
  "taxpayer",
  "tin",
  "participant",
  "beneficiary",
  "payee",
  "person",
  "dob",
  "date of birth",
  "birth date",
  "phone",
  "email",
  "address",
  "bank",
  "routing",
  "account",
  "benefit"
];

const piiNegativeTerms = [
  "plan",
  "policy",
  "directive",
  "im ",
  "version",
  "release",
  "page",
  "section",
  "table",
  "schedule",
  "form",
  "citation",
  "usc",
  "cfr",
  "actuarial",
  "rate",
  "liability",
  "dollar",
  "amount"
];

const validationControls = [
  { id: "FP-001", category: "directive", sampleText: "PBGC IM 10-03 is referenced for this workflow.", expected: "not_high_confidence" },
  { id: "FP-002", category: "version", sampleText: "The current release is v0.4.0.", expected: "not_high_confidence" },
  { id: "FP-003", category: "page", sampleText: "See page 12 for the policy summary.", expected: "not_high_confidence" },
  { id: "FP-004", category: "section", sampleText: "Review section 5.2 before export.", expected: "not_high_confidence" },
  { id: "FP-005", category: "date", sampleText: "The report was prepared on 05/02/2026.", expected: "not_high_confidence" },
  { id: "FP-006", category: "dollar", sampleText: "The plan liability is $1,250,000.", expected: "not_high_confidence" },
  { id: "FP-007", category: "rate", sampleText: "The actuarial rate is 5.75%.", expected: "not_high_confidence" },
  { id: "FP-008", category: "plan-code", sampleText: "Plan 123-45-6789 requires actuarial review.", expected: "not_high_confidence" },
  { id: "FP-009", category: "citation", sampleText: "5 U.S.C. 552a applies to Privacy Act records.", expected: "not_high_confidence" },
  { id: "TP-001", category: "ssn", sampleText: "SSN 123-45-6789 belongs to Jane Example.", expected: "detected" },
  { id: "TP-002", category: "taxpayer", sampleText: "Taxpayer ID 12-3456789 is associated with Jane Example.", expected: "detected" },
  { id: "TP-003", category: "participant", sampleText: "Participant Jane Example, SSN 123-45-6789, has a benefit record.", expected: "detected" },
  { id: "TP-004", category: "address", sampleText: "Jane Example lives at 100 Main Street.", expected: "detected" },
  { id: "TP-005", category: "phone", sampleText: "Jane Example phone: 202-555-0199.", expected: "detected" },
  { id: "TP-006", category: "email", sampleText: "Jane Example email: jane.example@example.gov.", expected: "detected" },
  { id: "TP-007", category: "dob", sampleText: "DOB 01/15/1960 for Jane Example.", expected: "detected" },
  { id: "TP-008", category: "payment", sampleText: "Jane Example bank routing 021000021 and account 123456789012.", expected: "detected" },
  { id: "TP-009", category: "benefit", sampleText: "Jane Example receives monthly benefit $1,234.56 tied to SSN 123-45-6789.", expected: "detected" }
];

const allowedExtensions = new Set(["txt", "md", "html", "htm", "pdf", "docx", "xlsx", "csv", "tsv", "json", "xml", "db", "sqlite"]);

const state = {
  files: [],
  documents: [],
  findings: [],
  outputHandle: null,
  exportMeta: defaultExportMeta(),
  detectorValidation: null,
  customRegexTests: []
};

const $ = (id) => document.getElementById(id);

const els = {
  themeToggle: $("themeToggle"),
  dropZone: $("dropZone"),
  fileInput: $("fileInput"),
  dirInput: $("dirInput"),
  processBtn: $("processBtn"),
  workflowBtn: $("workflowBtn"),
  workflowDialog: $("workflowDialog"),
  customRegexBtn: $("customRegexBtn"),
  customRegexDialog: $("customRegexDialog"),
  customRegexDescription: $("customRegexDescription"),
  customRegexPattern: $("customRegexPattern"),
  addCustomRegexBtn: $("addCustomRegexBtn"),
  customRegexStatus: $("customRegexStatus"),
  customRegexList: $("customRegexList"),
  progress: $("progress"),
  statusText: $("statusText"),
  appAlert: $("appAlert"),
  fileCount: $("fileCount"),
  findingCount: $("findingCount"),
  highCount: $("highCount"),
  reviewCount: $("reviewCount"),
  severityList: $("severityList"),
  findingsBody: $("findingsBody"),
  severityFilter: $("severityFilter"),
  clearBtn: $("clearBtn"),
  exportBtn: $("exportBtn"),
  chooseOutputBtn: $("chooseOutputBtn"),
  passwordInput: $("passwordInput"),
  passwordConfirmInput: $("passwordConfirmInput"),
  encryptionStatus: $("encryptionStatus"),
  validationSummary: $("validationSummary")
};

initTheme();
initializeApp();

if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

function defaultExportMeta() {
  return {
    archiveName: `${OUTPUT_DIR}.zip`,
    passwordRequired: false,
    passwordAccepted: false,
    passwordProtected: false,
    exportBlocked: false,
    blockedReason: "",
    encryptionStatus: ENCRYPTION_STATUS.notRequired,
    validationClaim: VALIDATION_CLAIM,
    limitations: []
  };
}

async function initializeApp() {
  try {
    state.customRegexTests = await loadCustomRegexTests();
    updateCustomRegexStatus();
    renderCustomRegexList();
  } catch (error) {
    updateCustomRegexStatus(`Custom regex storage unavailable: ${error.message}`, "error");
  }
  state.detectorValidation = runDetectorValidation();
  renderAll();
}

function normalizeFiles(fileList) {
  return Array.from(fileList);
}

function queueFiles(fileList) {
  const incoming = normalizeFiles(fileList);
  const known = new Set(state.files.map((file) => file.webkitRelativePath || file.name));
  for (const file of incoming) {
    const key = file.webkitRelativePath || file.name;
    if (!known.has(key)) state.files.push(file);
  }
  updateStatus(`${state.files.length} supported file(s) queued`);
  updateAlert(`${state.files.length} supported file(s) queued. Click Process queue to scan them.`, "info");
  renderSummary();
}

function updateStatus(message) {
  els.statusText.textContent = message;
}

function updateAlert(message, tone = "info") {
  els.appAlert.textContent = message;
  els.appAlert.className = `app-alert ${tone}`;
}

function showActionError(error) {
  const message = error?.message || String(error);
  updateStatus(`Action failed: ${message}`);
  updateAlert(`Action failed: ${message}`, "error");
  console.error(error);
}

function newId(prefix = "id") {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function openCustomRegexDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not available in this browser"));
      return;
    }
    const request = window.indexedDB.open(CUSTOM_REGEX_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CUSTOM_REGEX_STORE)) {
        const store = db.createObjectStore(CUSTOM_REGEX_STORE, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("IndexedDB open failed"));
  });
}

function idbRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("IndexedDB request failed"));
  });
}

async function loadCustomRegexTests() {
  if (!window.indexedDB) return [];
  const db = await openCustomRegexDb();
  try {
    const tx = db.transaction(CUSTOM_REGEX_STORE, "readonly");
    const items = await idbRequest(tx.objectStore(CUSTOM_REGEX_STORE).getAll());
    return items.sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
  } finally {
    db.close();
  }
}

async function saveCustomRegexTest(test) {
  const db = await openCustomRegexDb();
  try {
    const tx = db.transaction(CUSTOM_REGEX_STORE, "readwrite");
    await idbRequest(tx.objectStore(CUSTOM_REGEX_STORE).put(test));
  } finally {
    db.close();
  }
}

async function deleteCustomRegexTest(id) {
  const db = await openCustomRegexDb();
  try {
    const tx = db.transaction(CUSTOM_REGEX_STORE, "readwrite");
    await idbRequest(tx.objectStore(CUSTOM_REGEX_STORE).delete(id));
  } finally {
    db.close();
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("pbgc-pii-theme");
  const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  setTheme(initialTheme);
  els.themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("pbgc-pii-theme", nextTheme);
  });
}

function setTheme(theme) {
  const normalized = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = normalized;
  els.themeToggle.textContent = normalized === "dark" ? "☀" : "☾";
  els.themeToggle.setAttribute("aria-label", normalized === "dark" ? "Switch to light theme" : "Switch to dark theme");
  els.themeToggle.title = normalized === "dark" ? "Switch to light theme" : "Switch to dark theme";
}

async function readFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (!allowedExtensions.has(ext)) {
    return {
      text: "",
      extractedTextAvailable: false,
      limitations: [`Unsupported file extension .${ext || "unknown"} recorded and skipped.`]
    };
  }
  if (["txt", "md", "html", "htm", "csv", "tsv", "json", "xml"].includes(ext)) {
    return {
      text: await file.text(),
      extractedTextAvailable: true,
      limitations: []
    };
  }
  if (ext === "pdf") {
    return {
      text: await readPdf(file),
      extractedTextAvailable: true,
      limitations: []
    };
  }
  if (ext === "docx") {
    return {
      text: await readDocx(file),
      extractedTextAvailable: true,
      limitations: []
    };
  }
  if (ext === "xlsx") {
    return {
      text: await readXlsx(file),
      extractedTextAvailable: true,
      limitations: []
    };
  }
  if (["db", "sqlite"].includes(ext)) {
    return {
      text: "",
      extractedTextAvailable: false,
      limitations: ["DB/SQLite extraction is browser-limited in this static release unless a browser-safe extractor is added."]
    };
  }
  return {
    text: "",
    extractedTextAvailable: false,
    limitations: ["No extraction route is available for this file."]
  };
}

async function readPdf(file) {
  if (!window.pdfjsLib) throw new Error("pdf.js library not available");
  const data = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n\n");
}

async function readDocx(file) {
  if (!window.mammoth) throw new Error("mammoth library not available");
  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  return result.value || "";
}

async function readXlsx(file) {
  if (!window.XLSX) throw new Error("xlsx library not available");
  const arrayBuffer = await file.arrayBuffer();
  const workbook = window.XLSX.read(arrayBuffer);
  return workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    return `Sheet: ${sheetName}\n${window.XLSX.utils.sheet_to_csv(sheet)}`;
  }).join("\n\n");
}

function detectInDocument(doc, detectorList = activeDetectors()) {
  const findings = [];
  const seen = new Set();
  for (const detector of detectorList) {
    detector.regex.lastIndex = 0;
    for (const match of doc.text.matchAll(detector.regex)) {
      const value = match[0];
      const index = match.index || 0;
      const key = `${detector.type}:${index}:${value}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const context = contextFor(doc.text, index, value.length);
      const analysis = analyzeCandidate(detector, value, context);

      findings.push({
        id: newId("finding"),
        file: doc.path,
        type: analysis.type,
        match: value,
        masked: maskValue(value),
        context,
        contextSignals: analysis.contextSignals,
        severity: analysis.severity,
        confidence: analysis.confidence,
        confidenceReason: analysis.confidenceReason,
        policy: analysis.policy,
        action: analysis.action,
        decisionSource: "detector",
        decidedAt: "",
        location: { offset: index }
      });
    }
  }
  return findings.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
}

function activeDetectors() {
  return [...detectors, ...state.customRegexTests.map(customRegexToDetector)];
}

function customRegexToDetector(test) {
  return {
    type: `CUSTOM_${safeDetectorType(test.description)}`,
    regex: new RegExp(test.pattern, normalizeRegexFlags(test.flags)),
    severity: "medium",
    confidence: 0.65,
    policy: `User-defined regex: ${test.description}`,
    custom: true,
    description: test.description
  };
}

function normalizeRegexFlags(flags = "gi") {
  const accepted = new Set(String(flags || "gi").replace(/[^gimsuy]/g, "").split(""));
  accepted.add("g");
  return Array.from(accepted).join("");
}

function safeDetectorType(value) {
  return String(value || "REGEX")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase()
    .slice(0, 40) || "REGEX";
}

function analyzeCandidate(detector, value, context) {
  const contextSignals = extractContextSignals(context);
  const positive = contextSignals.positive.length;
  const negative = contextSignals.negative.length;
  let type = detector.type;
  let severity = detector.severity;
  let confidence = detector.confidence;
  let policy = detector.policy;
  let confidenceReason = "Base detector match with no contextual adjustment.";
  let action = defaultActionFor(severity);
  let suppressed = false;

  if (detector.falsePositive) {
    severity = "low";
    confidence = 0.2;
    confidenceReason = "Recognized as PBGC document, policy, actuarial, or regulatory text rather than PII.";
    action = DISPOSITIONS.falsePositive;
  } else if (detector.custom) {
    severity = "medium";
    confidence = 0.65;
    confidenceReason = `Matched user-defined regex test: ${detector.description}.`;
    action = DISPOSITIONS.unresolved;
  } else if (detector.type === "SSN" && negative > 0 && positive === 0) {
    type = "NUMERIC_PATTERN_AMBIGUOUS";
    severity = "low";
    confidence = 0.35;
    policy = "Pattern resembles PII but nearby PBGC document-control context supports false-positive treatment.";
    confidenceReason = `Downgraded because nearby non-PII context was found: ${contextSignals.negative.join(", ")}.`;
    action = DISPOSITIONS.falsePositive;
  } else if (detector.type === "EIN_OR_ROUTING" && negative > 0 && positive === 0) {
    type = "NUMERIC_PATTERN_AMBIGUOUS";
    severity = "low";
    confidence = 0.3;
    policy = "Numeric pattern appears in policy, plan, actuarial, or document-control context.";
    confidenceReason = `Downgraded because nearby non-PII context was found: ${contextSignals.negative.join(", ")}.`;
    action = DISPOSITIONS.falsePositive;
  } else if (detector.type === "EIN_OR_ROUTING" && positive > 0) {
    severity = "high";
    confidence = Math.max(confidence, 0.86);
    confidenceReason = `Elevated because nearby PII context was found: ${contextSignals.positive.join(", ")}.`;
    action = DISPOSITIONS.redact;
  } else if (detector.type === "PHONE" && negative > 0 && positive === 0) {
    severity = "low";
    confidence = 0.45;
    confidenceReason = `Downgraded because nearby non-PII context was found: ${contextSignals.negative.join(", ")}.`;
    action = DISPOSITIONS.unresolved;
  } else if (positive > 0 && severityRank[severity] < severityRank.high) {
    severity = "high";
    confidence = Math.min(0.95, confidence + 0.1);
    confidenceReason = `Elevated because nearby PII context was found: ${contextSignals.positive.join(", ")}.`;
    action = DISPOSITIONS.redact;
  } else if (negative > 0 && positive === 0 && detector.type === "IP_ADDRESS") {
    severity = "low";
    confidence = 0.25;
    confidenceReason = `Downgraded because nearby non-PII context was found: ${contextSignals.negative.join(", ")}.`;
    action = DISPOSITIONS.falsePositive;
  }

  return {
    type,
    severity,
    confidence,
    policy,
    confidenceReason,
    contextSignals,
    action,
    suppressed
  };
}

function extractContextSignals(context) {
  const normalized = ` ${context.toLowerCase().replace(/\s+/g, " ")} `;
  return {
    positive: piiPositiveTerms.filter((term) => normalized.includes(term)),
    negative: piiNegativeTerms.filter((term) => normalized.includes(term))
  };
}

function defaultActionFor(severity) {
  return severity === "critical" || severity === "high" ? DISPOSITIONS.redact : DISPOSITIONS.unresolved;
}

function contextFor(text, index, length) {
  const start = Math.max(0, index - 80);
  const end = Math.min(text.length, index + length + 80);
  return `${text.slice(start, index)}[[MATCH]]${text.slice(index, index + length)}[[/MATCH]]${text.slice(index + length, end)}`.replace(/\s+/g, " ").trim();
}

function maskValue(value) {
  if (value.length <= 4) return "****";
  return `${"*".repeat(Math.max(4, value.length - 4))}${value.slice(-4)}`;
}

function redactText(text, findings) {
  let output = text;
  const actionableFindings = findings
    .filter((finding) => [DISPOSITIONS.redact, DISPOSITIONS.erase].includes(normalizeAction(finding.action)))
    .filter((finding) => finding.match)
    .sort((a, b) => b.match.length - a.match.length);
  for (const finding of actionableFindings) {
    output = output.split(finding.match).join(redactionToken(finding));
  }
  return output;
}

function redactionToken(finding) {
  return normalizeAction(finding.action) === DISPOSITIONS.erase ? "[ERASED]" : "[REDACTED]";
}

async function processQueue() {
  if (!state.files.length) {
    updateStatus("Select files or a directory before processing");
    updateAlert("No files are queued. Select files, select a directory, or drop files into the intake area first.", "warning");
    return;
  }

  state.documents = [];
  state.findings = [];
  state.exportMeta = defaultExportMeta();
  els.progress.value = 0;
  renderEncryptionStatus();

  for (let index = 0; index < state.files.length; index += 1) {
    const file = state.files[index];
    const path = file.webkitRelativePath || file.name;
    updateStatus(`Processing ${path}`);
    try {
      const extracted = await readFile(file);
      const doc = {
        path,
        name: file.name,
        type: file.type || "unknown",
        size: file.size,
        text: extracted.text,
        extractedTextAvailable: extracted.extractedTextAvailable,
        limitations: extracted.limitations
      };
      state.documents.push(doc);
      if (extracted.limitations.length) {
        state.findings.push(createLimitationFinding(path, extracted.limitations.join(" ")));
      }
      state.findings.push(...detectInDocument(doc));
    } catch (error) {
      state.findings.push(createLimitationFinding(path, `File could not be read by available browser libraries: ${error.message}`));
    }
    els.progress.value = ((index + 1) / state.files.length) * 100;
  }

  migrateActions();
  updateStatus(`Processed ${state.files.length} file(s) with ${state.findings.length} finding(s)`);
  updateAlert(`Processing complete: ${state.files.length} file(s), ${state.findings.length} finding(s). Review findings, then export with a password if sensitive output exists.`, "success");
  renderAll();
}

function createLimitationFinding(file, message) {
  return {
    id: newId("limitation"),
    file,
    type: "PROCESSING_LIMITATION",
    match: message,
    masked: message,
    context: message,
    contextSignals: { positive: [], negative: [] },
    severity: "medium",
    confidence: 1,
    confidenceReason: "Operational limitation, not a PII pattern match.",
    policy: "Operational limitation recorded for PBGC IM 05-09 and IM 10-03 auditability",
    action: DISPOSITIONS.unresolved,
    decisionSource: "system",
    decidedAt: "",
    location: { unavailable: true }
  };
}

function migrateActions() {
  for (const finding of state.findings) {
    finding.action = normalizeAction(finding.action);
  }
}

function normalizeAction(action) {
  if (action === "needs_review") return DISPOSITIONS.unresolved;
  if (Object.values(DISPOSITIONS).includes(action)) return action;
  return DISPOSITIONS.unresolved;
}

async function addCustomRegexTest() {
  const description = els.customRegexDescription.value.trim();
  const pattern = els.customRegexPattern.value.trim();
  if (!description || !pattern) {
    updateCustomRegexStatus("Enter both a short description and a regex pattern.", "error");
    return;
  }
  try {
    new RegExp(pattern, normalizeRegexFlags());
  } catch (error) {
    updateCustomRegexStatus(`Regex syntax error: ${error.message}`, "error");
    return;
  }

  const test = {
    id: newId("regex"),
    description,
    pattern,
    flags: "gi",
    createdAt: new Date().toISOString()
  };
  await saveCustomRegexTest(test);
  state.customRegexTests = await loadCustomRegexTests();
  els.customRegexDescription.value = "";
  els.customRegexPattern.value = "";
  renderCustomRegexList();
  updateCustomRegexStatus("Custom regex test saved.", "success");
  state.detectorValidation = runDetectorValidation();
  renderValidationSummary();
}

async function removeCustomRegexTest(id) {
  await deleteCustomRegexTest(id);
  state.customRegexTests = await loadCustomRegexTests();
  renderCustomRegexList();
  updateCustomRegexStatus("Custom regex test removed.", "success");
  state.detectorValidation = runDetectorValidation();
  renderValidationSummary();
}

function updateCustomRegexStatus(message = "", tone = "") {
  if (!els.customRegexStatus) return;
  els.customRegexStatus.textContent = message || `${state.customRegexTests.length} saved user-defined regex test(s).`;
  els.customRegexStatus.className = `field-help ${tone}`.trim();
}

function renderCustomRegexList() {
  if (!els.customRegexList) return;
  if (!state.customRegexTests.length) {
    els.customRegexList.innerHTML = '<p class="field-help">No user-defined regex tests saved.</p>';
    return;
  }
  els.customRegexList.innerHTML = state.customRegexTests.map((test) => `
    <div class="custom-regex-item">
      <div>
        <strong>${escapeHtml(test.description)}</strong>
        <code>${escapeHtml(test.pattern)}</code>
      </div>
      <button class="danger" type="button" data-custom-regex-delete="${escapeHtml(test.id)}">Delete</button>
    </div>
  `).join("");
  els.customRegexList.querySelectorAll("[data-custom-regex-delete]").forEach((button) => {
    button.addEventListener("click", () => removeCustomRegexTest(button.dataset.customRegexDelete).catch(showActionError));
  });
}

function renderAll() {
  renderSummary();
  renderSeverity();
  renderFindings();
  renderEncryptionStatus();
  renderValidationSummary();
}

function renderSummary() {
  els.fileCount.textContent = String(state.files.length);
  els.findingCount.textContent = String(state.findings.length);
  els.highCount.textContent = String(state.findings.filter((f) => ["high", "critical"].includes(f.severity)).length);
  els.reviewCount.textContent = String(state.findings.filter((f) => normalizeAction(f.action) === DISPOSITIONS.unresolved).length);
}

function renderSeverity() {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const finding of state.findings) counts[finding.severity] += 1;
  els.severityList.innerHTML = Object.entries(counts)
    .map(([severity, count]) => `<div class="severity-row"><span class="badge ${severity}">${severity}</span><strong>${count}</strong></div>`)
    .join("");
}

function renderFindings() {
  const filter = els.severityFilter.value;
  const rows = state.findings
    .filter((finding) => filter === "all" || finding.severity === filter)
    .map((finding) => {
      const context = escapeHtml(finding.context)
        .replace("[[MATCH]]", '<span class="match">')
        .replace("[[/MATCH]]", "</span>");
      const reason = finding.confidenceReason || "No confidence explanation available.";
      return `
        <tr>
          <td>${escapeHtml(finding.file)}</td>
          <td>${escapeHtml(finding.type)}<br><small>${Math.round(finding.confidence * 100)}% confidence</small></td>
          <td><span class="badge ${finding.severity}">${finding.severity}</span></td>
          <td class="context">${context}<br><small>${escapeHtml(reason)}</small><br><small>${escapeHtml(finding.policy)}</small></td>
          <td>
            <select data-action="${finding.id}" aria-label="Action for ${escapeHtml(finding.type)}">
              ${actionOption(DISPOSITIONS.unresolved, "Unresolved", finding.action)}
              ${actionOption(DISPOSITIONS.retain, "Retain", finding.action)}
              ${actionOption(DISPOSITIONS.redact, "Redact", finding.action)}
              ${actionOption(DISPOSITIONS.erase, "Erase", finding.action)}
              ${actionOption(DISPOSITIONS.falsePositive, "False positive", finding.action)}
            </select>
          </td>
        </tr>
      `;
    })
    .join("");

  els.findingsBody.innerHTML = rows || '<tr><td colspan="5">No findings to display</td></tr>';
  els.findingsBody.querySelectorAll("[data-action]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const finding = state.findings.find((item) => item.id === event.target.dataset.action);
      if (finding) {
        const nextAction = normalizeAction(event.target.value);
        if ([DISPOSITIONS.redact, DISPOSITIONS.erase].includes(nextAction) && !confirmDestructiveAction(finding, nextAction)) {
          event.target.value = finding.action;
          return;
        }
        finding.action = nextAction;
        finding.decisionSource = "user";
        finding.decidedAt = new Date().toISOString();
      }
      state.exportMeta = defaultExportMeta();
      renderSummary();
      renderEncryptionStatus();
    });
  });
}

function confirmDestructiveAction(finding, action) {
  const verb = action === DISPOSITIONS.erase ? "erase" : "redact";
  return window.confirm(`Confirm ${verb} for ${finding.type} in ${finding.file}. Exported OCR/LLM-ready text will keep surrounding words intact and replace only the sensitive value with [REDACTED] or [ERASED].`);
}

function actionOption(value, label, current) {
  return `<option value="${value}" ${value === normalizeAction(current) ? "selected" : ""}>${label}</option>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function reportJson() {
  const manifestData = manifest();
  return {
    tool: "PBGC PII Detection",
    version: VERSION,
    feature: FEATURE_ID,
    generatedAt: new Date().toISOString(),
    policyReferences: POLICY_REFERENCES,
    summary: summaryData(),
    encryption: encryptionRecord(),
    detectorValidation: state.detectorValidation,
    findings: state.findings.map((finding) => ({
      ...finding,
      action: normalizeAction(finding.action),
      falsePositive: normalizeAction(finding.action) === DISPOSITIONS.falsePositive,
      match: normalizeAction(finding.action) === DISPOSITIONS.retain ? finding.match : finding.masked
    })),
    manifest: manifestData
  };
}

function reportCsv() {
  const header = ["file", "type", "severity", "confidence", "confidenceReason", "action", "masked", "policy", "context", "encryptionStatus"];
  const rows = state.findings.map((finding) => [
    finding.file,
    finding.type,
    finding.severity,
    finding.confidence,
    finding.confidenceReason,
    normalizeAction(finding.action),
    finding.masked,
    finding.policy,
    finding.context.replace("[[MATCH]]", "").replace("[[/MATCH]]", ""),
    state.exportMeta.encryptionStatus
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}

function reportHtml() {
  const rows = state.findings.map((finding) => `
    <tr>
      <td>${escapeHtml(finding.file)}</td>
      <td>${escapeHtml(finding.type)}</td>
      <td>${escapeHtml(finding.severity)}</td>
      <td>${escapeHtml(normalizeAction(finding.action))}</td>
      <td>${escapeHtml(finding.masked)}</td>
      <td>${escapeHtml(finding.confidenceReason)}</td>
      <td>${escapeHtml(finding.policy)}</td>
    </tr>
  `).join("");
  const encryption = encryptionRecord();
  return `<!doctype html><html><head><meta charset="utf-8"><title>PII Report</title></head><body>
    <h1>PBGC PII Detection Report v${VERSION}</h1>
    <p>Feature: ${escapeHtml(FEATURE_ID)}</p>
    <p>Generated ${new Date().toISOString()}</p>
    <h2>Compliance Evidence</h2>
    <p>Policy references: ${POLICY_REFERENCES.map(escapeHtml).join("; ")}</p>
    <ul>${POLICY_OBLIGATIONS.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    <p>Detector validation: false-positive pass rate ${formatRate(state.detectorValidation.falsePositivePassRate)}, true-positive pass rate ${formatRate(state.detectorValidation.truePositivePassRate)}.</p>
    <p>User-defined regex tests active: ${state.customRegexTests.length}.</p>
    <h2>Encryption Summary</h2>
    <p>Status: ${escapeHtml(encryption.encryptionStatus)}. Password required: ${encryption.passwordRequired ? "yes" : "no"}. Password protected: ${encryption.passwordProtected ? "yes" : "no"}.</p>
    <p>${escapeHtml(encryption.validationClaim)}</p>
    <table border="1" cellspacing="0" cellpadding="6">
      <thead><tr><th>File</th><th>Type</th><th>Severity</th><th>Action</th><th>Masked</th><th>Confidence Reason</th><th>Policy</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body></html>`;
}

function formatRate(value) {
  return typeof value === "number" ? `${Math.round(value * 100)}%` : "not available";
}

function summaryData() {
  return {
    files: state.files.length,
    findings: state.findings.length,
    confirmedOrSuspectedPii: state.findings.filter(isSensitiveFinding).length,
    unresolved: state.findings.filter((f) => normalizeAction(f.action) === DISPOSITIONS.unresolved).length,
    falsePositives: state.findings.filter((f) => normalizeAction(f.action) === DISPOSITIONS.falsePositive).length,
    highOrCritical: state.findings.filter((f) => ["high", "critical"].includes(f.severity)).length
  };
}

function manifest() {
  return {
    tool: "PBGC PII Detection",
    version: VERSION,
    feature: FEATURE_ID,
    generatedAt: new Date().toISOString(),
    outputDirectory: OUTPUT_DIR,
    toolVersion: VERSION,
    createdAt: new Date().toISOString(),
    policyReferences: POLICY_REFERENCES,
    policyObligations: POLICY_OBLIGATIONS,
    summary: summaryData(),
    sourceFiles: state.files.map((file) => ({
      name: file.name,
      path: file.webkitRelativePath || file.name,
      size: file.size,
      type: file.type || "unknown"
    })),
    customRegexTests: state.customRegexTests.map(({ id, description, pattern, createdAt }) => ({
      id,
      description,
      pattern,
      createdAt
    })),
    findings: state.findings.map((finding) => ({
      id: finding.id,
      file: finding.file,
      type: finding.type,
      masked: finding.masked,
      context: finding.context,
      contextSignals: finding.contextSignals,
      severity: finding.severity,
      confidence: finding.confidence,
      confidenceReason: finding.confidenceReason,
      policy: finding.policy,
      action: normalizeAction(finding.action),
      decidedAt: finding.decidedAt || "",
      decisionSource: finding.decisionSource || "unknown"
    })),
    outputs: [
      "pii-findings.json",
      "pii-findings.csv",
      "pii-findings.html",
      "manifest.json",
      "redacted-text/*.txt with semantic placeholders that preserve surrounding text for OCR/LLM review",
      "redacted-pdf/*.pdf with semantic placeholders where browser PDF generation is available"
    ],
    archive: {
      name: state.exportMeta.archiveName,
      passwordProtected: state.exportMeta.passwordProtected,
      limitations: state.exportMeta.limitations
    },
    encryption: encryptionRecord(),
    detectorValidation: state.detectorValidation,
    limitations: limitationList()
  };
}

function limitationList() {
  return [
    "Browser file APIs require user selection for input and output locations.",
    "Password-protected zip export is local protection only; IM 10-03 requires PBGC-approved encryption or secure file transfer for electronic dissemination outside PBGC.",
    "The app cannot grant CPO approval for removal of PII from PBGC devices, networks, contractor environments, or the workplace.",
    "Redaction/export actions do not replace PBGC records management, CUI disposal, or breach reporting procedures.",
    "Redacted outputs preserve non-PII text for OCR/LLM analysis and replace sensitive values with neutral placeholders: [REDACTED] or [ERASED].",
    "Exact native document-to-PDF conversion is limited by browser libraries; extracted text PDFs are generated where supported.",
    "Unresolved findings remain marked as unresolved in exports.",
    VALIDATION_CLAIM,
    ...state.exportMeta.limitations,
    ...state.documents.flatMap((doc) => doc.limitations || [])
  ];
}

function encryptionRecord() {
  return {
    passwordRequired: state.exportMeta.passwordRequired,
    passwordAccepted: state.exportMeta.passwordAccepted,
    passwordProtected: state.exportMeta.passwordProtected,
    exportBlocked: state.exportMeta.exportBlocked,
    blockedReason: state.exportMeta.blockedReason,
    archiveName: state.exportMeta.archiveName,
    encryptionStatus: state.exportMeta.encryptionStatus,
    validationClaim: state.exportMeta.validationClaim,
    limitations: state.exportMeta.limitations
  };
}

async function exportOutput() {
  try {
    if (!state.findings.length && !state.documents.length) {
      updateStatus("Process files before exporting");
      updateAlert("Export cannot run yet. Process files first, then review findings.", "warning");
      return;
    }

    const validation = prepareArchiveMetadata();
    renderEncryptionStatus();
    if (validation.blocked) {
      updateStatus(validation.message);
      updateAlert(validation.message, "error");
      return;
    }
    if (!confirmExportRemediation()) {
      updateAlert("Export cancelled before package creation.", "warning");
      return;
    }

    const files = await buildOutputFiles();
    const zipBlob = await createZip(files, els.passwordInput.value);
    const zipName = `${OUTPUT_DIR}.zip`;

    if (state.outputHandle) {
      const dir = await state.outputHandle.getDirectoryHandle(OUTPUT_DIR, { create: true });
      await writeFile(dir, zipName, zipBlob);
      for (const file of files) await writeFile(dir, file.name, file.blob);
      updateStatus(exportStatusMessage(`Export written to selected ${OUTPUT_DIR} directory`));
      updateAlert(exportStatusMessage(`Export written to selected ${OUTPUT_DIR} directory`), "success");
    } else {
      downloadBlob(zipBlob, zipName);
      updateStatus(exportStatusMessage("Export zip downloaded through browser downloads"));
      updateAlert(exportStatusMessage("Export zip downloaded through browser downloads"), "success");
    }
    renderEncryptionStatus();
  } catch (error) {
    showActionError(error);
  }
}

function prepareArchiveMetadata() {
  const sensitive = hasSensitiveExport();
  const password = els.passwordInput.value;
  const confirmation = els.passwordConfirmInput.value;
  const passwordResult = validatePassword(password, confirmation);
  state.exportMeta = {
    ...defaultExportMeta(),
    passwordRequired: sensitive,
    passwordAccepted: passwordResult.valid,
    passwordProtected: false,
    encryptionStatus: sensitive ? ENCRYPTION_STATUS.blocked : ENCRYPTION_STATUS.notRequired
  };

  if (sensitive && !passwordResult.valid) {
    state.exportMeta.exportBlocked = true;
    state.exportMeta.blockedReason = passwordResult.reason;
    state.exportMeta.limitations.push(passwordResult.reason);
    return { blocked: true, message: passwordResult.reason };
  }

  if (sensitive && !window.zip) {
    const reason = "Sensitive export blocked because zip.js password protection is unavailable in this browser session.";
    state.exportMeta.exportBlocked = true;
    state.exportMeta.blockedReason = reason;
    state.exportMeta.limitations.push(reason);
    return { blocked: true, message: reason };
  }

  if (!window.zip) {
    state.exportMeta.encryptionStatus = ENCRYPTION_STATUS.limited;
    state.exportMeta.limitations.push("zip.js unavailable; non-sensitive export will download a JSON fallback blob.");
    return { blocked: false, message: "Export allowed with zip.js limitation because no sensitive output was detected." };
  }

  state.exportMeta.passwordProtected = sensitive;
  state.exportMeta.encryptionStatus = sensitive ? ENCRYPTION_STATUS.protected : ENCRYPTION_STATUS.notRequired;
  return { blocked: false, message: "Export allowed." };
}

function validatePassword(password, confirmation) {
  if (!password) return { valid: false, reason: "Sensitive export requires an encryption password." };
  if (password.length < 12) return { valid: false, reason: "Encryption password must be at least 12 characters." };
  const classes = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ].filter(Boolean).length;
  if (classes < 3) return { valid: false, reason: "Encryption password must include at least three of uppercase letters, lowercase letters, numbers, and symbols." };
  if (password !== confirmation) return { valid: false, reason: "Encryption password confirmation does not match." };
  return { valid: true, reason: "" };
}

function hasSensitiveExport() {
  return state.findings.some(isSensitiveFinding);
}

function isSensitiveFinding(finding) {
  if (!finding || finding.type === "PROCESSING_LIMITATION") return false;
  return normalizeAction(finding.action) !== DISPOSITIONS.falsePositive;
}

function confirmExportRemediation() {
  const destructiveCount = state.findings.filter((finding) => [DISPOSITIONS.redact, DISPOSITIONS.erase].includes(normalizeAction(finding.action))).length;
  if (!destructiveCount) return true;
  return window.confirm(`Confirm export with ${destructiveCount} redact/erase decision(s). Exported document renditions will apply these decisions and the manifest will record them.`);
}

async function buildOutputFiles() {
  const output = [
    textFile("pii-findings.json", JSON.stringify(reportJson(), null, 2), "application/json"),
    textFile("pii-findings.csv", reportCsv(), "text/csv"),
    textFile("pii-findings.html", reportHtml(), "text/html"),
    textFile("manifest.json", JSON.stringify(manifest(), null, 2), "application/json")
  ];

  for (const doc of state.documents) {
    const findings = state.findings.filter((finding) => finding.file === doc.path);
    const safeName = safeFileName(doc.path);
    const redacted = redactText(doc.text, findings);
    output.push(textFile(`redacted-text/${safeName}.txt`, redacted, "text/plain"));
    const pdfBlob = createPdfBlob(redacted, doc.path);
    if (pdfBlob) output.push({ name: `redacted-pdf/${safeName}.pdf`, blob: pdfBlob });
  }

  return output;
}

function textFile(name, content, type) {
  return { name, blob: new Blob([content], { type }) };
}

function createPdfBlob(text, title) {
  if (!window.jspdf?.jsPDF) return null;
  const pdf = new window.jspdf.jsPDF({ unit: "pt", format: "letter" });
  const margin = 40;
  const width = pdf.internal.pageSize.getWidth() - margin * 2;
  pdf.setFont("helvetica", "bold");
  pdf.text(`Redacted text rendition: ${title}`, margin, margin);
  pdf.setFont("helvetica", "normal");
  const lines = pdf.splitTextToSize(text || "[No extracted text]", width);
  let y = margin + 28;
  for (const line of lines) {
    if (y > 750) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(line, margin, y);
    y += 14;
  }
  return pdf.output("blob");
}

async function createZip(files, password) {
  if (!window.zip) {
    return new Blob([JSON.stringify({ error: "zip.js unavailable", files: files.map((file) => file.name) }, null, 2)], { type: "application/json" });
  }
  const sensitive = hasSensitiveExport();
  const writerOptions = sensitive ? { password, encryptionStrength: 3 } : {};
  const writer = new window.zip.ZipWriter(new window.zip.BlobWriter("application/zip"), writerOptions);
  for (const file of files) {
    await writer.add(file.name, new window.zip.BlobReader(file.blob));
  }
  const blob = await writer.close();
  state.exportMeta.passwordProtected = sensitive;
  state.exportMeta.encryptionStatus = sensitive ? ENCRYPTION_STATUS.protected : ENCRYPTION_STATUS.notRequired;
  return blob;
}

function exportStatusMessage(prefix) {
  const status = state.exportMeta.encryptionStatus.replace("_", " ");
  return `${prefix}. Encryption status: ${status}. Password protected: ${state.exportMeta.passwordProtected ? "yes" : "no"}.`;
}

function renderEncryptionStatus() {
  const meta = state.exportMeta || defaultExportMeta();
  const sensitive = hasSensitiveExport();
  const status = sensitive && meta.encryptionStatus === ENCRYPTION_STATUS.notRequired && !meta.passwordProtected
    ? ENCRYPTION_STATUS.blocked
    : meta.encryptionStatus || (sensitive ? ENCRYPTION_STATUS.blocked : ENCRYPTION_STATUS.notRequired);
  els.encryptionStatus.className = `status-pill ${statusClass(status)}`;
  els.encryptionStatus.textContent = `Encryption status: ${status.replace("_", " ")}${sensitive ? " (sensitive output)" : " (not required)"}`;
}

function statusClass(status) {
  if (status === ENCRYPTION_STATUS.protected) return "protected";
  if (status === ENCRYPTION_STATUS.blocked) return "blocked";
  if (status === ENCRYPTION_STATUS.notRequired) return "not-required";
  return "limited";
}

function renderValidationSummary() {
  const validation = state.detectorValidation || runDetectorValidation();
  els.validationSummary.textContent = `Detector validation: FP ${formatRate(validation.falsePositivePassRate)}, TP ${formatRate(validation.truePositivePassRate)}`;
}

function runDetectorValidation() {
  const controls = validationControls.map((control) => {
    const findings = detectInDocument({ path: control.id, text: control.sampleText }, detectors);
    const highConfidencePii = findings.some((finding) => normalizeAction(finding.action) !== DISPOSITIONS.falsePositive && finding.confidence >= 0.7 && severityRank[finding.severity] >= severityRank.medium);
    const detectedPii = findings.some((finding) => normalizeAction(finding.action) !== DISPOSITIONS.falsePositive);
    const passed = control.expected === "detected" ? detectedPii : !highConfidencePii;
    return {
      controlId: control.id,
      controlCategory: control.category,
      expectedOutcome: control.expected,
      actualOutcome: findings.length ? findings.map((finding) => `${finding.type}:${finding.severity}:${finding.confidence}`).join("; ") : "no finding",
      confidence: findings[0]?.confidence || 0,
      severity: findings[0]?.severity || "none",
      explanation: findings[0]?.confidenceReason || "No finding generated.",
      passed
    };
  });
  const fpControls = controls.filter((control) => control.controlId.startsWith("FP-"));
  const tpControls = controls.filter((control) => control.controlId.startsWith("TP-"));
  return {
    feature: FEATURE_ID,
    generatedAt: new Date().toISOString(),
    falsePositivePassRate: passRate(fpControls),
    truePositivePassRate: passRate(tpControls),
    controls
  };
}

function passRate(controls) {
  if (!controls.length) return 0;
  return controls.filter((control) => control.passed).length / controls.length;
}

async function writeFile(dirHandle, name, blob) {
  const parts = name.split("/");
  let dir = dirHandle;
  while (parts.length > 1) {
    dir = await dir.getDirectoryHandle(parts.shift(), { create: true });
  }
  const fileHandle = await dir.getFileHandle(parts[0], { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function safeFileName(name) {
  return name.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 120);
}

async function chooseOutputDirectory() {
  try {
    if (!window.showDirectoryPicker) {
      const message = "This browser does not support choosing an output folder from this page. Use Export reviewed output; the zip will download through the browser downloads folder.";
      updateStatus("Directory picker is not supported; export will download a zip instead.");
      updateAlert(message, "warning");
      return;
    }
    state.outputHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    updateStatus(`Output directory selected; ${OUTPUT_DIR} will be created there`);
    updateAlert(`Output directory selected. Export will create ${OUTPUT_DIR} there.`, "success");
  } catch (error) {
    if (error?.name === "AbortError") {
      const message = "Output directory selection was cancelled. Export will download a zip through the browser downloads folder.";
      updateStatus("Output directory selection was cancelled; export will download a zip instead.");
      updateAlert(message, "warning");
      return;
    }
    showActionError(error);
  }
}

function clearState() {
  state.files = [];
  state.documents = [];
  state.findings = [];
  state.exportMeta = defaultExportMeta();
  els.progress.value = 0;
  els.passwordInput.value = "";
  els.passwordConfirmInput.value = "";
  updateStatus("No files queued");
  updateAlert("Ready. Select files or drop them here to begin.", "info");
  renderAll();
}

els.fileInput.addEventListener("change", (event) => queueFiles(event.target.files));
els.dirInput.addEventListener("change", (event) => queueFiles(event.target.files));
els.processBtn.addEventListener("click", () => processQueue().catch(showActionError));
els.workflowBtn.addEventListener("click", () => els.workflowDialog.showModal());
els.customRegexBtn.addEventListener("click", () => {
  renderCustomRegexList();
  updateCustomRegexStatus();
  els.customRegexDialog.showModal();
});
els.addCustomRegexBtn.addEventListener("click", () => addCustomRegexTest().catch(showActionError));
els.clearBtn.addEventListener("click", clearState);
els.severityFilter.addEventListener("change", renderFindings);
els.exportBtn.addEventListener("click", exportOutput);
els.chooseOutputBtn.addEventListener("click", chooseOutputDirectory);
els.passwordInput.addEventListener("input", () => {
  state.exportMeta = defaultExportMeta();
  renderEncryptionStatus();
});
els.passwordConfirmInput.addEventListener("input", () => {
  state.exportMeta = defaultExportMeta();
  renderEncryptionStatus();
});

["dragenter", "dragover"].forEach((name) => {
  els.dropZone.addEventListener(name, (event) => {
    event.preventDefault();
    els.dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((name) => {
  els.dropZone.addEventListener(name, () => els.dropZone.classList.remove("is-dragging"));
});

els.dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  queueFiles(event.dataTransfer.files);
});

setTimeout(() => {
  if (!els.workflowDialog.open) els.workflowDialog.showModal();
}, 300);
