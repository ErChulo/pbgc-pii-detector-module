const VERSION = "0.4.0";
const OUTPUT_DIR = "pii-output-v0.4.0";

const severityRank = { low: 1, medium: 2, high: 3, critical: 4 };

const detectors = [
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

const allowedExtensions = new Set(["txt", "md", "html", "htm", "pdf", "docx", "xlsx", "csv", "tsv", "json", "xml", "db", "sqlite"]);

const state = {
  files: [],
  documents: [],
  findings: [],
  outputHandle: null
};

const $ = (id) => document.getElementById(id);

const els = {
  dropZone: $("dropZone"),
  fileInput: $("fileInput"),
  dirInput: $("dirInput"),
  processBtn: $("processBtn"),
  workflowBtn: $("workflowBtn"),
  workflowDialog: $("workflowDialog"),
  progress: $("progress"),
  statusText: $("statusText"),
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
  passwordInput: $("passwordInput")
};

if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

function normalizeFiles(fileList) {
  return Array.from(fileList).filter((file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    return allowedExtensions.has(ext);
  });
}

function queueFiles(fileList) {
  const incoming = normalizeFiles(fileList);
  const known = new Set(state.files.map((file) => file.webkitRelativePath || file.name));
  for (const file of incoming) {
    const key = file.webkitRelativePath || file.name;
    if (!known.has(key)) state.files.push(file);
  }
  updateStatus(`${state.files.length} supported file(s) queued`);
  renderSummary();
}

function updateStatus(message) {
  els.statusText.textContent = message;
}

async function readFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (["txt", "md", "html", "htm", "csv", "tsv", "json", "xml"].includes(ext)) {
    return file.text();
  }
  if (ext === "pdf") return readPdf(file);
  if (ext === "docx") return readDocx(file);
  if (ext === "xlsx") return readXlsx(file);
  if (["db", "sqlite"].includes(ext)) return "[SQLite file queued. Browser SQL extraction is not enabled in this static release.]";
  return "";
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

function detectInDocument(doc) {
  const findings = [];
  const seen = new Set();
  for (const detector of detectors) {
    detector.regex.lastIndex = 0;
    for (const match of doc.text.matchAll(detector.regex)) {
      const value = match[0];
      const index = match.index || 0;
      const key = `${detector.type}:${index}:${value}`;
      if (seen.has(key)) continue;
      seen.add(key);
      findings.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${findings.length}`,
        file: doc.path,
        type: detector.type,
        match: value,
        masked: maskValue(value),
        context: contextFor(doc.text, index, value.length),
        severity: detector.severity,
        confidence: detector.confidence,
        policy: detector.policy,
        action: detector.severity === "critical" || detector.severity === "high" ? "redact" : "needs_review",
        location: { offset: index }
      });
    }
  }
  return findings.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
}

function contextFor(text, index, length) {
  const start = Math.max(0, index - 60);
  const end = Math.min(text.length, index + length + 60);
  return `${text.slice(start, index)}[[MATCH]]${text.slice(index, index + length)}[[/MATCH]]${text.slice(index + length, end)}`.replace(/\s+/g, " ").trim();
}

function maskValue(value) {
  if (value.length <= 4) return "****";
  return `${"*".repeat(Math.max(4, value.length - 4))}${value.slice(-4)}`;
}

function redactText(text, findings) {
  let output = text;
  const values = [...new Set(findings.filter((finding) => ["redact", "erase"].includes(finding.action)).map((finding) => finding.match))];
  for (const value of values) {
    output = output.split(value).join("[REDACTED]");
  }
  return output;
}

async function processQueue() {
  if (!state.files.length) {
    updateStatus("Select files or a directory before processing");
    return;
  }

  state.documents = [];
  state.findings = [];
  els.progress.value = 0;

  for (let index = 0; index < state.files.length; index += 1) {
    const file = state.files[index];
    const path = file.webkitRelativePath || file.name;
    updateStatus(`Processing ${path}`);
    try {
      const text = await readFile(file);
      const doc = { path, name: file.name, type: file.type || "unknown", text };
      state.documents.push(doc);
      state.findings.push(...detectInDocument(doc));
    } catch (error) {
      state.findings.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`,
        file: path,
        type: "READ_ERROR",
        match: error.message,
        masked: error.message,
        context: "File could not be read by available browser libraries.",
        severity: "medium",
        confidence: 1,
        policy: "Operational limitation recorded for auditability",
        action: "needs_review",
        location: { offset: 0 }
      });
    }
    els.progress.value = ((index + 1) / state.files.length) * 100;
  }

  updateStatus(`Processed ${state.files.length} file(s) with ${state.findings.length} finding(s)`);
  renderAll();
}

function renderAll() {
  renderSummary();
  renderSeverity();
  renderFindings();
}

function renderSummary() {
  els.fileCount.textContent = String(state.files.length);
  els.findingCount.textContent = String(state.findings.length);
  els.highCount.textContent = String(state.findings.filter((f) => ["high", "critical"].includes(f.severity)).length);
  els.reviewCount.textContent = String(state.findings.filter((f) => f.action === "needs_review").length);
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
      return `
        <tr>
          <td>${escapeHtml(finding.file)}</td>
          <td>${escapeHtml(finding.type)}<br><small>${Math.round(finding.confidence * 100)}% confidence</small></td>
          <td><span class="badge ${finding.severity}">${finding.severity}</span></td>
          <td class="context">${context}<br><small>${escapeHtml(finding.policy)}</small></td>
          <td>
            <select data-action="${finding.id}" aria-label="Action for ${escapeHtml(finding.type)}">
              ${actionOption("needs_review", "Needs review", finding.action)}
              ${actionOption("retain", "Retain", finding.action)}
              ${actionOption("redact", "Redact", finding.action)}
              ${actionOption("erase", "Erase", finding.action)}
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
      if (finding) finding.action = event.target.value;
      renderSummary();
    });
  });
}

function actionOption(value, label, current) {
  return `<option value="${value}" ${value === current ? "selected" : ""}>${label}</option>`;
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
  return {
    tool: "PBGC PII Detection",
    version: VERSION,
    generatedAt: new Date().toISOString(),
    policyReferences: ["PBGC IM 05-09 Privacy Program", "PBGC IM 10-03 Protecting Personally Identifiable Information"],
    summary: {
      files: state.files.length,
      findings: state.findings.length,
      highOrCritical: state.findings.filter((f) => ["high", "critical"].includes(f.severity)).length,
      needsReview: state.findings.filter((f) => f.action === "needs_review").length
    },
    findings: state.findings.map((finding) => ({
      ...finding,
      match: finding.action === "retain" ? finding.match : finding.masked
    }))
  };
}

function reportCsv() {
  const header = ["file", "type", "severity", "confidence", "action", "masked", "policy", "context"];
  const rows = state.findings.map((finding) => [
    finding.file,
    finding.type,
    finding.severity,
    finding.confidence,
    finding.action,
    finding.masked,
    finding.policy,
    finding.context.replace("[[MATCH]]", "").replace("[[/MATCH]]", "")
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function reportHtml() {
  const rows = state.findings.map((finding) => `
    <tr>
      <td>${escapeHtml(finding.file)}</td>
      <td>${escapeHtml(finding.type)}</td>
      <td>${escapeHtml(finding.severity)}</td>
      <td>${escapeHtml(finding.action)}</td>
      <td>${escapeHtml(finding.masked)}</td>
      <td>${escapeHtml(finding.policy)}</td>
    </tr>
  `).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>PII Report</title></head><body>
    <h1>PBGC PII Detection Report v${VERSION}</h1>
    <p>Generated ${new Date().toISOString()}</p>
    <table border="1" cellspacing="0" cellpadding="6">
      <thead><tr><th>File</th><th>Type</th><th>Severity</th><th>Action</th><th>Masked</th><th>Policy</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body></html>`;
}

function manifest() {
  return {
    outputDirectory: OUTPUT_DIR,
    toolVersion: VERSION,
    createdAt: new Date().toISOString(),
    sourceFiles: state.files.map((file) => ({
      name: file.name,
      path: file.webkitRelativePath || file.name,
      size: file.size,
      type: file.type || "unknown"
    })),
    outputs: [
      "pii-findings.json",
      "pii-findings.csv",
      "pii-findings.html",
      "redacted-text/*.txt",
      "redacted-pdf/*.pdf where browser PDF generation is available"
    ],
    limitations: [
      "Browser file APIs require user selection for input and output locations.",
      "Exact native document-to-PDF conversion is limited by browser libraries; extracted text PDFs are generated where supported.",
      "Unreviewed findings remain marked as needs_review in exports."
    ]
  };
}

async function exportOutput() {
  if (!state.findings.length && !state.documents.length) {
    updateStatus("Process files before exporting");
    return;
  }

  const files = await buildOutputFiles();
  const password = els.passwordInput.value.trim();
  const zipBlob = await createZip(files, password);
  const zipName = `${OUTPUT_DIR}.zip`;

  if (state.outputHandle) {
    const dir = await state.outputHandle.getDirectoryHandle(OUTPUT_DIR, { create: true });
    await writeFile(dir, zipName, zipBlob);
    for (const file of files) await writeFile(dir, file.name, file.blob);
    updateStatus(`Export written to selected ${OUTPUT_DIR} directory`);
  } else {
    downloadBlob(zipBlob, zipName);
    updateStatus("Export zip downloaded through browser downloads");
  }
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
  const writer = new window.zip.ZipWriter(new window.zip.BlobWriter("application/zip"), password ? { password, encryptionStrength: 3 } : {});
  for (const file of files) {
    await writer.add(file.name, new window.zip.BlobReader(file.blob));
  }
  return writer.close();
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
  if (!window.showDirectoryPicker) {
    updateStatus("Directory picker is not supported; export will download a zip");
    return;
  }
  state.outputHandle = await window.showDirectoryPicker({ mode: "readwrite" });
  updateStatus(`Output directory selected; ${OUTPUT_DIR} will be created there`);
}

els.fileInput.addEventListener("change", (event) => queueFiles(event.target.files));
els.dirInput.addEventListener("change", (event) => queueFiles(event.target.files));
els.processBtn.addEventListener("click", processQueue);
els.workflowBtn.addEventListener("click", () => els.workflowDialog.showModal());
els.clearBtn.addEventListener("click", () => {
  state.files = [];
  state.documents = [];
  state.findings = [];
  els.progress.value = 0;
  updateStatus("No files queued");
  renderAll();
});
els.severityFilter.addEventListener("change", renderFindings);
els.exportBtn.addEventListener("click", exportOutput);
els.chooseOutputBtn.addEventListener("click", chooseOutputDirectory);

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

renderAll();
setTimeout(() => {
  if (!els.workflowDialog.open) els.workflowDialog.showModal();
}, 300);
