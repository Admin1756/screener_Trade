import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  FIELDS,
  FIELD_LABEL,
  REQUIRED_FIELDS,
  autoMap,
  parseFile,
  validateRows,
  type Field,
  type ParsedFile,
  type ValidationResult,
} from "@/lib/import";
import { cn } from "@/lib/utils";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = [".xlsx", ".xls", ".csv"];
const CHUNK = 500;

type Stage = "idle" | "parsing" | "preview" | "publishing" | "done";

export function DatabaseUploader({ onPublished }: { onPublished: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [mapping, setMapping] = useState<Partial<Record<Field, string>>>({});
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function revalidate(next: Partial<Record<Field, string>>, source?: ParsedFile) {
    const base = source ?? parsed;
    if (!base) return;
    setMapping(next);
    setResult(validateRows(base.rows, next));
  }

  async function handleFile(file: File) {
    setError(null);
    setSuccess(null);
    if (!ALLOWED.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      setError("Unsupported file type. Upload an .xlsx, .xls or .csv file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is larger than the 15 MB limit.");
      return;
    }
    setStage("parsing");
    setFileName(file.name);
    try {
      const data = await parseFile(file);
      if (data.rows.length === 0) {
        setError("No rows were found in this file.");
        setStage("idle");
        return;
      }
      const detected = autoMap(data.headers);
      setParsed(data);
      setMapping(detected);
      setResult(validateRows(data.rows, detected));
      setStage("preview");
    } catch {
      setError("We couldn't read this file. Check that it is a valid Excel or CSV export.");
      setStage("idle");
    }
  }

  async function publish() {
    if (!result || result.records.length === 0) return;
    setStage("publishing");
    setProgress(0);
    setError(null);
    try {
      const { data: latest } = await supabase
        .from("dataset_versions")
        .select("version")
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();
      const nextVersion = (latest?.version ?? 0) + 1;

      const { data: created, error: createError } = await supabase
        .from("dataset_versions")
        .insert({
          version: nextVersion,
          status: "draft",
          source_filename: fileName,
          record_count: result.records.length,
          error_count: result.errorCount,
          warning_count: result.warningCount,
        })
        .select("id")
        .single();
      if (createError) throw createError;

      const datasetId = created.id;
      try {
        for (let i = 0; i < result.records.length; i += CHUNK) {
          const chunk = result.records
            .slice(i, i + CHUNK)
            .map((r) => ({ ...r, dataset_version_id: datasetId }));
          const { error: insertError } = await supabase.from("stocks").insert(chunk);
          if (insertError) throw insertError;
          setProgress(Math.round(Math.min(100, ((i + chunk.length) / result.records.length) * 100)));
        }

        const { error: publishError } = await supabase.rpc("publish_dataset", {
          _dataset_id: datasetId,
        });
        if (publishError) throw publishError;
      } catch (innerErr) {
        // Draft failed validation/insert — mark it failed so the live dataset stays untouched.
        await supabase.from("dataset_versions").update({ status: "failed" }).eq("id", datasetId);
        throw innerErr;
      }

      setSuccess(
        `Database version ${nextVersion} is now live with ${result.records.length.toLocaleString()} records.`,
      );
      setStage("done");
      onPublished();
    } catch (err) {
      setError(
        err instanceof Error
          ? `Publish failed — the previous database is still active. ${err.message}`
          : "Publish failed — the previous database is still active.",
      );
      setStage("preview");
    }
  }

  function reset() {
    setStage("idle");
    setParsed(null);
    setResult(null);
    setMapping({});
    setFileName("");
    setProgress(0);
    setError(null);
  }

  const missingRequired = REQUIRED_FIELDS.filter((f) => !mapping[f]);
  const canPublish =
    !!result && result.records.length > 0 && missingRequired.length === 0 && stage === "preview";

  return (
    <section className="rounded-2xl border border-border glass">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <p className="label-mono">Upload Stock Database</p>
        {stage !== "idle" ? (
          <button
            type="button"
            onClick={reset}
            className="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Start over
          </button>
        ) : null}
      </header>

      <div className="p-5 sm:p-6">
        {stage === "idle" || stage === "parsing" ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) void handleFile(file);
            }}
            className={cn(
              "grid place-items-center rounded-xl border border-dashed px-6 py-14 text-center transition-colors",
              dragging ? "border-primary bg-primary/5" : "border-border bg-surface/40",
            )}
          >
            {stage === "parsing" ? (
              <>
                <Loader2 className="size-6 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Reading {fileName}…</p>
              </>
            ) : (
              <>
                <UploadCloud className="size-7 text-muted-foreground" />
                <p className="mt-4 text-sm font-medium">Drag &amp; drop your Excel or CSV file here</p>
                <p className="mt-1 text-xs text-muted-foreground">.xlsx, .xls or .csv · up to 15 MB</p>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-5 rounded-lg border border-border bg-panel px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40"
                >
                  Browse Files
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFile(file);
                    e.target.value = "";
                  }}
                />
              </>
            )}
          </div>
        ) : null}

        {(stage === "preview" || stage === "publishing" || stage === "done") && result ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm">
              <FileSpreadsheet className="size-4 text-primary" />
              <span className="font-mono text-xs">{fileName}</span>
            </div>

            <div>
              <p className="label-mono">Database Import Preview</p>
              <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
                {[
                  ["Total rows", result.totalRows],
                  ["Valid records", result.validRows],
                  ["Warnings", result.warningCount],
                  ["Errors", result.errorCount],
                ].map(([label, value]) => (
                  <div key={label as string} className="bg-surface p-4">
                    <p className="label-mono">{label as string}</p>
                    <p className="mt-1 font-mono text-xl font-semibold">
                      {(value as number).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Previous database will remain active until the new dataset is successfully
                validated.
              </p>
            </div>

            <div>
              <p className="label-mono">Column mapping</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {FIELDS.map((field) => (
                  <label key={field} className="flex items-center gap-3 text-sm">
                    <span className="w-44 shrink-0 text-muted-foreground">
                      {FIELD_LABEL[field]}
                      {REQUIRED_FIELDS.includes(field) ? (
                        <span className="text-destructive"> *</span>
                      ) : null}
                    </span>
                    <select
                      value={mapping[field] ?? ""}
                      onChange={(e) =>
                        revalidate({ ...mapping, [field]: e.target.value || undefined })
                      }
                      className="min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-xs focus:border-primary/60 focus:outline-none"
                    >
                      <option value="">— not mapped —</option>
                      {parsed?.headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              {missingRequired.length > 0 ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-warning">
                  <AlertTriangle className="size-4" />
                  Map required columns: {missingRequired.map((f) => FIELD_LABEL[f]).join(", ")}
                </p>
              ) : null}
            </div>

            {result.issues.length > 0 ? (
              <div>
                <p className="label-mono">Issues ({result.issues.length})</p>
                <ul className="mt-3 max-h-56 space-y-1 overflow-auto rounded-xl border border-border bg-surface/60 p-3 font-mono text-[11px]">
                  {result.issues.slice(0, 200).map((issue, i) => (
                    <li
                      key={`${issue.row}-${i}`}
                      className={
                        issue.level === "error" ? "text-destructive" : "text-muted-foreground"
                      }
                    >
                      Row {issue.row}: {issue.message}
                    </li>
                  ))}
                  {result.issues.length > 200 ? <li>…and more</li> : null}
                </ul>
              </div>
            ) : null}

            {stage === "publishing" ? (
              <div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  Uploading records… {progress}%
                </p>
              </div>
            ) : null}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {success ? (
              <p className="flex items-center gap-2 text-sm text-success">
                <CheckCircle2 className="size-4" /> {success}
              </p>
            ) : null}

            {stage !== "done" ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={reset}
                  disabled={stage === "publishing"}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-panel disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={publish}
                  disabled={!canPublish}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {stage === "publishing" ? <Loader2 className="size-4 animate-spin" /> : null}
                  Publish New Database
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {stage === "idle" && error ? (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        ) : null}
      </div>
    </section>
  );
}
