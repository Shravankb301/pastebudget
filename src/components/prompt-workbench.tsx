"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  CheckCircle2,
  CircleAlert,
  Clipboard,
  Copy,
  Download,
  FilePlus2,
  FileText,
  Gauge,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  Scissors,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent } from "@/lib/analytics";
import { splitTextIntoChunks, type TextChunk } from "@/lib/chunk-text";
import {
  DEFAULT_MODEL_ID,
  formatTokens,
  getModelPreset,
  MODEL_DATA_VERIFIED_AT,
  MODEL_PRESETS,
} from "@/lib/models";
import { analyzeText, buildFitReport } from "@/lib/text-analysis";

const SAMPLE_PROMPT = `You are reviewing customer interviews for a small B2B product.

Goal
Identify the three most repeated workflow problems, the language customers use to describe them, and the smallest product changes that would remove the most friction.

Instructions
- Separate direct evidence from your interpretation.
- Quote only short phrases from the source material.
- Call out contradictions between interviews.
- End with a ranked recommendation and the evidence behind each choice.

Interview notes
Customer A exports a CSV every Friday, deletes six columns, fixes date formatting, and sends it to finance. Customer B does the same cleanup twice a week but keeps a private spreadsheet of column mappings. Customer C stopped using the export because the cleanup took longer than rebuilding the report manually.`;

const ALLOWED_EXTENSIONS = new Set([
  "txt",
  "md",
  "mdx",
  "json",
  "csv",
  "tsv",
  "html",
  "xml",
  "yaml",
  "yml",
  "log",
  "js",
  "jsx",
  "ts",
  "tsx",
  "py",
  "go",
  "rs",
  "java",
  "c",
  "cpp",
  "h",
  "hpp",
  "css",
  "sql",
]);

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024;

type LocalFile = {
  id: string;
  name: string;
  size: number;
  text: string;
};

type CountState = {
  id: number;
  count: number;
  status: "idle" | "counting" | "ready";
  error?: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.max(0, Math.round(value)));
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function sourceExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function PromptWorkbench() {
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [customContext, setCustomContext] = useState(128_000);
  const [customOutput, setCustomOutput] = useState(32_000);
  const [responseReserve, setResponseReserve] = useState(16_000);
  const [existingUsage, setExistingUsage] = useState(0);
  const [chunkSize, setChunkSize] = useState(8_000);
  const [overlapTokens, setOverlapTokens] = useState(200);
  const [chunks, setChunks] = useState<TextChunk[]>([]);
  const [isChunking, setIsChunking] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState("");
  const [copied, setCopied] = useState("");
  const [countState, setCountState] = useState<CountState>({
    id: 0,
    count: 0,
    status: "idle",
  });
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);

  const selectedPreset = getModelPreset(modelId);
  const isCustom = modelId === "custom";
  const contextWindow = isCustom
    ? Math.max(1_000, customContext)
    : selectedPreset.contextWindow;
  const maxOutput = isCustom
    ? Math.max(1_000, Math.min(customOutput, contextWindow))
    : (selectedPreset.maxOutput ?? selectedPreset.contextWindow);

  const combinedText = useMemo(() => {
    const sections = [draft.trim()];
    for (const file of files) {
      sections.push(`Source: ${file.name}\n\n${file.text.trim()}`);
    }
    return sections.filter(Boolean).join("\n\n---\n\n");
  }, [draft, files]);

  useEffect(() => {
    const worker = new Worker(new URL("../workers/token-worker.ts", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (
      event: MessageEvent<{ id: number; count: number; error?: string }>,
    ) => {
      if (event.data.id !== requestIdRef.current) return;
      setCountState({
        id: event.data.id,
        count: event.data.count,
        status: "ready",
        error: event.data.error,
      });
    };

    worker.onerror = () => {
      setCountState((current) => ({
        ...current,
        status: "ready",
        error: "Exact counting was unavailable. Refresh the page and try again.",
      }));
    };

    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  useEffect(() => {
    const nextId = requestIdRef.current + 1;
    requestIdRef.current = nextId;
    const timeout = window.setTimeout(() => {
      if (!combinedText) {
        setCountState({ id: nextId, count: 0, status: "idle" });
        return;
      }

      setCountState((current) => ({
        ...current,
        id: nextId,
        status: "counting",
      }));
      workerRef.current?.postMessage({ id: nextId, text: combinedText });
    }, combinedText ? 180 : 0);

    return () => window.clearTimeout(timeout);
  }, [combinedText]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(""), 1_800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const referenceCount = countState.count;
  const modelTokenCount =
    selectedPreset.tokenizer === "o200k" || isCustom
      ? referenceCount
      : Math.ceil(referenceCount * 1.12);
  const effectiveResponseReserve = Math.min(responseReserve, maxOutput);
  const availableInput = Math.max(
    0,
    contextWindow - effectiveResponseReserve - existingUsage,
  );
  const remaining = availableInput - modelTokenCount;
  const utilization =
    availableInput === 0 ? (modelTokenCount > 0 ? 100 : 0) : (modelTokenCount / availableInput) * 100;
  const analysis = analyzeText(combinedText);
  const hasContent = combinedText.length > 0;
  const fits = hasContent && remaining >= 0;
  const isClose = fits && utilization >= 80;
  const verdict = !hasContent
    ? "Waiting for your prompt"
    : countState.status === "counting"
      ? "Measuring locally…"
      : fits
        ? isClose
          ? "Fits, with limited headroom"
          : "Fits comfortably"
        : "Too large for this budget";

  async function addFiles(fileList: FileList | File[]) {
    setFileError("");
    const incoming = Array.from(fileList);
    const currentBytes = files.reduce((total, file) => total + file.size, 0);
    let acceptedBytes = currentBytes;
    const accepted: LocalFile[] = [];

    for (const file of incoming) {
      if (!ALLOWED_EXTENSIONS.has(sourceExtension(file.name))) {
        setFileError("Use a plain-text, Markdown, data, or source-code file.");
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setFileError(`${file.name} is larger than the 5 MB per-file limit.`);
        continue;
      }
      if (acceptedBytes + file.size > MAX_TOTAL_BYTES) {
        setFileError("The local file limit is 10 MB per session.");
        break;
      }

      const contents = await file.text();
      if (contents.includes("\u0000")) {
        setFileError(`${file.name} does not look like a text file.`);
        continue;
      }

      accepted.push({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        name: file.name,
        size: file.size,
        text: contents,
      });
      acceptedBytes += file.size;
    }

    if (accepted.length) {
      setFiles((current) => [...current, ...accepted]);
      setChunks([]);
      trackEvent("file_added", { count: accepted.length });
    }
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) void addFiles(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragActive(false);
    void addFiles(event.dataTransfer.files);
  }

  function loadSample() {
    setDraft(SAMPLE_PROMPT);
    setFiles([]);
    setChunks([]);
    setFileError("");
    trackEvent("sample_loaded");
  }

  function clearAll() {
    setDraft("");
    setFiles([]);
    setChunks([]);
    setFileError("");
  }

  async function copyReport() {
    const report = buildFitReport({
      modelName: isCustom ? "Custom limit" : selectedPreset.name,
      tokenCount: modelTokenCount,
      availableTokens: availableInput,
      responseReserve: effectiveResponseReserve,
      existingUsage,
    });
    await navigator.clipboard.writeText(report);
    setCopied("report");
    trackEvent("fit_report_copied", { fits });
  }

  async function createChunks() {
    if (!combinedText) return;
    setIsChunking(true);
    setFileError("");

    try {
      if (availableInput < 64) {
        throw new Error("Reduce the response reserve or existing context before creating chunks.");
      }
      const { encode } = await import("gpt-tokenizer");
      const multiplier =
        selectedPreset.tokenizer === "o200k" || isCustom ? 1 : 1.12;
      const countTokens = (value: string) =>
        Math.ceil(encode(value).length * multiplier);
      const safeLimit = Math.max(64, Math.min(chunkSize, availableInput));
      const nextChunks = splitTextIntoChunks(
        combinedText,
        safeLimit,
        Math.min(overlapTokens, safeLimit - 1),
        countTokens,
      );
      setChunks(nextChunks);
      trackEvent("chunks_created", {
        count: nextChunks.length,
        chunk_size: safeLimit,
      });
    } catch (error) {
      setFileError(
        error instanceof Error ? error.message : "Unable to split this text.",
      );
    } finally {
      setIsChunking(false);
    }
  }

  async function copyChunk(chunk: TextChunk, index: number) {
    const labeled = `Part ${index + 1} of ${chunks.length}\n\n${chunk.text}`;
    await navigator.clipboard.writeText(labeled);
    setCopied(`chunk-${index}`);
    trackEvent("chunk_copied", { position: index + 1, total: chunks.length });
  }

  function downloadChunks() {
    const output = chunks
      .map(
        (chunk, index) =>
          `# Part ${index + 1} of ${chunks.length}\n\n${chunk.text}`,
      )
      .join("\n\n---\n\n");
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "pastebudget-chunks.md";
    anchor.click();
    URL.revokeObjectURL(url);
    trackEvent("chunks_downloaded", { count: chunks.length });
  }

  return (
    <section id="tool" aria-labelledby="tool-heading" className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-700">
            Context workbench
          </p>
          <h2 id="tool-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Measure the input. Keep room for the answer.
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <ShieldCheck className="size-4 text-emerald-700" aria-hidden="true" />
          No upload. No prompt storage.
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)]">
        <Card className="overflow-hidden border-stone-300/80 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.05),0_16px_40px_rgba(28,25,23,0.04)]">
          <CardHeader className="border-b border-stone-200 pb-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Your material</CardTitle>
                <CardDescription className="mt-1">
                  Paste a prompt, then add any text-based files it references.
                </CardDescription>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={loadSample}
                  className="text-stone-600"
                  data-analytics="sample-loaded"
                >
                  <FileText className="size-3.5" />
                  Sample
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={clearAll}
                  aria-label="Clear prompt and files"
                  disabled={!hasContent}
                >
                  <RotateCcw className="size-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="relative">
              <Label htmlFor="prompt-input" className="sr-only">
                Prompt or text to measure
              </Label>
              <Textarea
                id="prompt-input"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setChunks([]);
                }}
                placeholder="Paste the prompt, document, transcript, or code you plan to send…"
                className="min-h-80 resize-y border-stone-300 bg-stone-50/60 p-4 font-mono text-[0.82rem] leading-6 shadow-inner placeholder:font-sans placeholder:text-stone-400 focus-visible:bg-white sm:min-h-96"
                spellCheck={false}
              />
              {countState.status === "counting" && (
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-[0.68rem] font-medium text-stone-500 shadow-sm">
                  <LoaderCircle className="size-3 animate-spin" />
                  Counting
                </span>
              )}
            </div>

            <label
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className={`flex min-h-20 cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-3 text-center transition-colors focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-stone-300 bg-stone-50 hover:border-stone-400 hover:bg-stone-100/80"
              }`}
            >
              <input
                type="file"
                multiple
                className="sr-only"
                accept=".txt,.md,.mdx,.json,.csv,.tsv,.html,.xml,.yaml,.yml,.log,.js,.jsx,.ts,.tsx,.py,.go,.rs,.java,.c,.cpp,.h,.hpp,.css,.sql"
                onChange={handleFileInput}
              />
              <span className="flex size-9 items-center justify-center rounded-md border border-stone-200 bg-white shadow-sm">
                <FilePlus2 className="size-4 text-stone-700" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-medium text-stone-800">
                  Add text or code files
                </span>
                <span className="block text-xs text-stone-500">
                  Drop here or browse · 5 MB each
                </span>
              </span>
            </label>

            {files.length > 0 && (
              <div className="space-y-2" aria-label="Added files">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="size-3.5 shrink-0 text-indigo-600" />
                      <span className="truncate font-medium">{file.name}</span>
                      <span className="shrink-0 text-xs text-stone-400">
                        {formatBytes(file.size)}
                      </span>
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        {
                          setFiles((current) =>
                            current.filter((item) => item.id !== file.id),
                          );
                          setChunks([]);
                        }
                      }
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {fileError && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                {fileError}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
              <span>{formatNumber(analysis.characters)} characters</span>
              <span>{formatNumber(analysis.lines)} lines</span>
              <span>{formatNumber(analysis.words)} words</span>
              <span>{analysis.readingMinutes || 0} min read</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5 lg:sticky lg:top-24">
          <Card className="border-stone-300/80 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.05),0_16px_40px_rgba(28,25,23,0.04)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Target context</CardTitle>
              <CardDescription>
                API presets use documented limits. Consumer chat plans can differ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="model-select">Model or limit</Label>
                <Select
                  value={modelId}
                  onValueChange={(value) => {
                    setModelId(value);
                    setChunks([]);
                  }}
                >
                  <SelectTrigger id="model-select" className="w-full border-stone-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_PRESETS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} · {formatTokens(model.contextWindow)}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom context limit</SelectItem>
                  </SelectContent>
                </Select>
                {!isCustom && (
                  <p className="text-xs text-stone-500">
                    {selectedPreset.provider} · limits checked {MODEL_DATA_VERIFIED_AT} ·{" "}
                    <a
                      href={selectedPreset.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-indigo-700 underline-offset-4 hover:underline"
                    >
                      official source
                    </a>
                  </p>
                )}
              </div>

              {isCustom && (
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="custom-context" className="text-xs">
                      Context window
                    </Label>
                    <Input
                      id="custom-context"
                      type="number"
                      min={1_000}
                      max={10_000_000}
                      value={customContext}
                      onChange={(event) => {
                        setCustomContext(Number(event.target.value) || 1_000);
                        setChunks([]);
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="custom-output" className="text-xs">
                      Max output
                    </Label>
                    <Input
                      id="custom-output"
                      type="number"
                      min={1_000}
                      max={customContext}
                      value={customOutput}
                      onChange={(event) => {
                        setCustomOutput(Number(event.target.value) || 1_000);
                        setChunks([]);
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="response-reserve">Reserve for the answer</Label>
                  <span className="font-mono text-xs font-semibold tabular-nums text-stone-700">
                    {formatTokens(effectiveResponseReserve)}
                  </span>
                </div>
                <Slider
                  id="response-reserve"
                  min={1_000}
                  max={Math.max(1_000, maxOutput)}
                  step={1_000}
                  value={[effectiveResponseReserve]}
                  onValueChange={([value]) => {
                    setResponseReserve(value);
                    setChunks([]);
                  }}
                  aria-label="Tokens reserved for model response"
                />
                <p className="text-xs leading-5 text-stone-500">
                  PasteBudget subtracts this from the window instead of pretending the entire context is available for input.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="existing-usage">Already used in this chat</Label>
                  <span className="text-xs text-stone-400">Optional</span>
                </div>
                <Input
                  id="existing-usage"
                  type="number"
                  min={0}
                  max={contextWindow}
                  step={1_000}
                  value={existingUsage}
                  onChange={(event) => {
                    setExistingUsage(
                      Math.min(contextWindow, Math.max(0, Number(event.target.value) || 0)),
                    );
                    setChunks([]);
                  }}
                  className="border-stone-300 font-mono tabular-nums"
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`overflow-hidden border-2 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.05),0_16px_40px_rgba(28,25,23,0.04)] ${
              !hasContent
                ? "border-stone-200"
                : fits
                  ? isClose
                    ? "border-amber-300"
                    : "border-emerald-300"
                  : "border-red-300"
            }`}
            aria-live="polite"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-xs font-medium text-stone-500">Verdict</p>
                  <CardTitle className="text-xl tracking-tight">{verdict}</CardTitle>
                </div>
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                    !hasContent
                      ? "bg-stone-100 text-stone-500"
                      : fits
                        ? isClose
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {!hasContent ? (
                    <Gauge className="size-5" />
                  ) : fits ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <CircleAlert className="size-5" />
                  )}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <span className="text-sm text-stone-600">
                    {selectedPreset.tokenizer === "o200k" || isCustom ? "Tokens" : "Conservative estimate"}
                  </span>
                  <span className="font-mono text-xl font-semibold tabular-nums tracking-tight">
                    {selectedPreset.tokenizer === "estimated" && !isCustom && hasContent ? "≈" : ""}
                    {formatNumber(modelTokenCount)}
                    <span className="ml-1 text-xs font-normal text-stone-400">
                      / {formatNumber(availableInput)}
                    </span>
                  </span>
                </div>
                <Progress
                  value={Math.min(100, utilization)}
                  className={`h-2.5 ${
                    !hasContent
                      ? "[&_[data-slot=progress-indicator]]:bg-stone-300"
                      : fits
                        ? isClose
                          ? "[&_[data-slot=progress-indicator]]:bg-amber-500"
                          : "[&_[data-slot=progress-indicator]]:bg-emerald-600"
                        : "[&_[data-slot=progress-indicator]]:bg-red-600"
                  }`}
                />
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>{hasContent ? `${Math.max(0, utilization).toFixed(utilization < 1 ? 2 : 1)}% used` : "0% used"}</span>
                  <span>
                    {hasContent
                      ? remaining >= 0
                        ? `${formatTokens(remaining)} headroom`
                        : `${formatTokens(Math.abs(remaining))} over`
                      : `${formatTokens(availableInput)} available`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200">
                <div className="bg-stone-50 p-3">
                  <p className="text-[0.68rem] uppercase tracking-wide text-stone-500">Reference count</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums">{formatNumber(referenceCount)}</p>
                </div>
                <div className="bg-stone-50 p-3">
                  <p className="text-[0.68rem] uppercase tracking-wide text-stone-500">Answer reserve</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums">{formatTokens(effectiveResponseReserve)}</p>
                </div>
                <div className="bg-stone-50 p-3">
                  <p className="text-[0.68rem] uppercase tracking-wide text-stone-500">Existing context</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums">{formatTokens(existingUsage)}</p>
                </div>
                <div className="bg-stone-50 p-3">
                  <p className="text-[0.68rem] uppercase tracking-wide text-stone-500">Model window</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums">{formatTokens(contextWindow)}</p>
                </div>
              </div>

              {selectedPreset.tokenizer === "estimated" && !isCustom && (
                <p className="rounded-md border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-xs leading-5 text-indigo-900">
                  This model does not publish a browser tokenizer. PasteBudget applies a 12% safety margin to the exact o200k reference count.
                </p>
              )}
              {countState.error && (
                <p className="text-xs leading-5 text-amber-800">{countState.error}</p>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={copyReport}
                disabled={!hasContent || countState.status === "counting"}
                className="w-full border-stone-300"
                data-analytics="fit-report-copied"
              >
                {copied === "report" ? <Check className="size-4" /> : <Clipboard className="size-4" />}
                {copied === "report" ? "Report copied" : "Copy private fit report"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-stone-300/80 bg-[#171717] text-stone-50 shadow-[0_16px_40px_rgba(28,25,23,0.12)]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-md bg-white/10">
                  <Scissors className="size-4" />
                </span>
                <div>
                  <CardTitle className="text-base text-white">Make paste-ready chunks</CardTitle>
                  <CardDescription className="mt-0.5 text-stone-400">
                    Split at readable boundaries with optional overlap.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="chunk-size" className="text-xs text-stone-300">
                    Tokens per part
                  </Label>
                  <Input
                    id="chunk-size"
                    type="number"
                    min={64}
                    max={Math.max(64, availableInput || contextWindow)}
                    step={500}
                    value={chunkSize}
                    onChange={(event) => {
                      setChunkSize(Number(event.target.value) || 64);
                      setChunks([]);
                    }}
                    className="border-white/15 bg-white/5 font-mono text-white tabular-nums"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="chunk-overlap" className="text-xs text-stone-300">
                    Overlap tokens
                  </Label>
                  <Input
                    id="chunk-overlap"
                    type="number"
                    min={0}
                    max={Math.max(0, chunkSize - 1)}
                    step={50}
                    value={overlapTokens}
                    onChange={(event) => {
                      setOverlapTokens(Number(event.target.value) || 0);
                      setChunks([]);
                    }}
                    className="border-white/15 bg-white/5 font-mono text-white tabular-nums"
                  />
                </div>
              </div>
              <Button
                type="button"
                onClick={createChunks}
                disabled={
                  !hasContent ||
                  isChunking ||
                  countState.status === "counting" ||
                  availableInput < 64
                }
                className="w-full bg-white text-stone-950 hover:bg-stone-200"
                data-analytics="chunks-created"
              >
                {isChunking ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Scissors className="size-4" />
                )}
                {isChunking ? "Splitting locally…" : "Create chunks"}
              </Button>
              <p className="flex items-start gap-2 text-xs leading-5 text-stone-400">
                <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
                Chunking happens only in this tab. Labels get 24 tokens of reserved room.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {chunks.length > 0 && (
        <Card className="mt-5 border-stone-300/80 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.05),0_16px_40px_rgba(28,25,23,0.04)]">
          <CardHeader className="flex flex-col gap-4 border-b border-stone-200 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">{chunks.length} paste-ready parts</CardTitle>
              <CardDescription className="mt-1">
                Copy one at a time, in order, or download a single Markdown file.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={downloadChunks} className="border-stone-300">
              <Download className="size-4" />
              Download all
            </Button>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <Accordion type="single" collapsible className="w-full">
              {chunks.map((chunk, index) => (
                <AccordionItem key={`${index}-${chunk.tokens}`} value={`chunk-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex flex-1 items-center justify-between gap-4 pr-3 text-left">
                      <span className="font-medium">Part {index + 1}</span>
                      <Badge variant="secondary" className="font-mono font-normal tabular-nums">
                        {formatNumber(chunk.tokens)} tokens
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border border-stone-200 bg-stone-50 p-4 font-mono text-xs leading-5 text-stone-700">
                        {chunk.text}
                      </pre>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => copyChunk(chunk, index)}
                        className="border-stone-300"
                      >
                        {copied === `chunk-${index}` ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        {copied === `chunk-${index}` ? "Copied" : `Copy part ${index + 1}`}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      <Separator className="mt-12 bg-stone-300/70" />
    </section>
  );
}
