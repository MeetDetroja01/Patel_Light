"use client";
import { useState, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

type ExportFormat = "csv" | "excel" | "pdf";

const COLUMNS = [
  { key: "date",           label: "Date" },
  { key: "bill_number",    label: "Bill Number" },
  { key: "customer_name",  label: "Customer Name" },
  { key: "mobile_number",  label: "Mobile Number" },
  { key: "shop_name",      label: "Shop Name" },
  { key: "state",          label: "State" },
  { key: "city",           label: "City" },
  { key: "transport_name", label: "Transport Name" },
  { key: "items_sent",     label: "Items Sent" },
  { key: "total_amount",   label: "Total Amount" },
];

interface BillRow {
  date: string; bill_number: string; customer_name: string;
  mobile_number: string; shop_name: string; state: string;
  city: string; transport_name: string; items_sent: string;
  total_amount: number;
}

export default function ImportExportPage() {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ inserted: number; skipped: number } | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  /* ── IMPORT ── */
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setImportResult(null);
    setParsedRows([]);
    setPreview([]);

    try {
      const XLSX = (await import("xlsx")).default;
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      setParsedRows(rows);
      setPreview(rows.slice(0, 5));
    } catch {
      toast({ title: "File read failed", description: "Please use .csv or .xlsx format", variant: "destructive" });
    }
  }

  async function handleImport() {
    if (parsedRows.length === 0) return;
    setImporting(true);
    const res = await fetch("/api/bills/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: parsedRows }),
    });
    const data = await res.json();
    setImporting(false);
    if (res.ok) {
      setImportResult(data);
      setPreview([]); setParsedRows([]); setFileName("");
      if (fileRef.current) fileRef.current.value = "";
      toast({ title: `✅ ${data.inserted} bills imported!` });
    } else {
      toast({ title: "Import failed", description: data.error, variant: "destructive" });
    }
  }

  /* ── EXPORT ── */
  async function handleExport(format: ExportFormat) {
    setExporting(format);
    try {
      const res = await fetch("/api/bills/export");
      const { bills }: { bills: BillRow[] } = await res.json();
      if (!bills?.length) {
        toast({ title: "No data to export", variant: "destructive" });
        setExporting(null); return;
      }
      if (format === "csv")   exportCSV(bills);
      if (format === "excel") await exportExcel(bills);
      if (format === "pdf")   await exportPDF(bills);
    } catch (err) {
      toast({ title: "Export failed", description: String(err), variant: "destructive" });
    }
    setExporting(null);
  }

  function exportCSV(bills: BillRow[]) {
    const header = COLUMNS.map((c) => `"${c.label}"`).join(",");
    const rows = bills.map((b) =>
      COLUMNS.map((c) => `"${String(b[c.key as keyof BillRow] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, "patel-light-bills.csv");
  }

  async function exportExcel(bills: BillRow[]) {
    try {
      const XLSX = (await import("xlsx")).default;
      const data = bills.map((b) =>
        Object.fromEntries(COLUMNS.map((c) => [c.label, b[c.key as keyof BillRow] ?? ""]))
      );
      const ws = XLSX.utils.json_to_sheet(data);
      ws["!cols"] = COLUMNS.map(() => ({ wch: 20 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Bills");
      XLSX.writeFile(wb, "patel-light-bills.xlsx");
    } catch (e) {
      throw new Error("Excel export failed: " + String(e));
    }
  }

  async function exportPDF(bills: BillRow[]) {
    try {
      // Use require-style dynamic import to avoid ESM/CJS mismatch
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.jsPDF ?? jsPDFModule.default;
      const autoTableModule = await import("jspdf-autotable");
      const autoTable = autoTableModule.default ?? autoTableModule.applyPlugin;

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      doc.setFontSize(16);
      doc.setTextColor(253, 3, 4);
      doc.text("Patel Light — Bills Report", 14, 14);
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}  |  Total: ${bills.length} bills`, 14, 21);

      autoTable(doc, {
        startY: 26,
        head: [COLUMNS.map((c) => c.label)],
        body: bills.map((b) => COLUMNS.map((c) => String(b[c.key as keyof BillRow] ?? ""))),
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [253, 3, 4], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [254, 242, 242] },
      });
      doc.save("patel-light-bills.pdf");
    } catch (e) {
      throw new Error("PDF export failed: " + String(e));
    }
  }

  function triggerDownload(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadTemplate() {
    const XLSX = (await import("xlsx")).default;
    const ws = XLSX.utils.aoa_to_sheet([
      COLUMNS.map((c) => c.label),
      ["2024-01-15", "PL-001", "Sample Customer", "9876543210", "Sample Shop", "Gujarat", "Ahmedabad", "DTDC", "Item 1, Item 2", "15000"],
    ]);
    ws["!cols"] = Array(10).fill({ wch: 20 });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "patel-light-template.xlsx");
  }

  /* ── RENDER ── */
  return (
    <>
      <Toaster />
      <div className="animate-fade-in space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: "linear-gradient(135deg,#Fd0304,#ff6b6b)", color: "#fff" }}>
              📂
            </span>
            Import & Export
          </h1>
          <p className="text-sm text-slate-500 mt-1 ml-11">Upload bills from CSV/Excel or download your data.</p>
        </div>

        {/* EXPORT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg">⬇️</span>
            <h2 className="font-semibold text-slate-800">Export Data</h2>
            <span className="ml-auto text-xs text-slate-400">Downloads all bills</span>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500 mb-5">Export your complete bills database in your preferred format.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { fmt: "csv"   as ExportFormat, icon: "📄", label: "CSV",   desc: "Universal format",        color: "#10b981" },
                { fmt: "excel" as ExportFormat, icon: "📊", label: "Excel", desc: "Microsoft Excel (.xlsx)", color: "#1d6f42" },
                { fmt: "pdf"   as ExportFormat, icon: "📋", label: "PDF",   desc: "Printable report",        color: "#Fd0304" },
              ]).map(({ fmt, icon, label, desc, color }) => (
                <button key={fmt} onClick={() => handleExport(fmt)} disabled={exporting !== null}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-dashed hover:border-solid transition-all disabled:opacity-50 group"
                  style={{ borderColor: `${color}50` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${color}18` }}>
                    {exporting === fmt
                      ? <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                      : icon}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-slate-800 text-sm">{label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: `${color}18`, color }}>
                    {exporting === fmt ? "Preparing…" : `Export ${label}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* IMPORT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg">⬆️</span>
            <h2 className="font-semibold text-slate-800">Import Bills</h2>
            <span className="ml-auto text-xs text-slate-400">CSV or Excel</span>
          </div>
          <div className="p-6 space-y-5">

            {/* Info */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <span className="text-xl">💡</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-800 mb-1">Required column headers</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {COLUMNS.map((c) => (
                    <span key={c.key} className="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-mono font-medium">{c.label}</span>
                  ))}
                </div>
                <button onClick={downloadTemplate}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2">
                  ⬇️ Download blank template (.xlsx)
                </button>
              </div>
            </div>

            {/* File picker */}
            <div onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#Fd0304] hover:bg-red-50/30 transition-all">
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileChange} />
              <div className="text-4xl mb-3">{fileName ? "📄" : "📁"}</div>
              {fileName
                ? <><p className="font-semibold text-slate-700 text-sm">{fileName}</p><p className="text-xs text-slate-400 mt-1">Click to change</p></>
                : <><p className="font-semibold text-slate-600 text-sm">Click to select file</p><p className="text-xs text-slate-400 mt-1">Supports .csv, .xlsx, .xls</p></>
              }
            </div>

            {/* Preview */}
            {preview.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Preview — first {preview.length} of {parsedRows.length} rows
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {Object.keys(preview[0]).map((k) => (
                          <th key={k} className="px-3 py-2 text-left font-semibold text-slate-500 whitespace-nowrap">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i} className="border-b border-slate-100 last:border-0">
                          {Object.values(row).map((v, j) => (
                            <td key={j} className="px-3 py-2 text-slate-700 whitespace-nowrap max-w-[150px] truncate">{String(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={handleImport} disabled={importing}
                  className="mt-4 w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(to right,#ff6b6b,#Fd0304)" }}>
                  {importing ? "Importing…" : `⬆️ Import ${parsedRows.length} Bills`}
                </button>
              </div>
            )}

            {/* Result */}
            {importResult && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-800 text-sm">Import successful!</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    {importResult.inserted} bills added{importResult.skipped > 0 ? `, ${importResult.skipped} skipped` : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
