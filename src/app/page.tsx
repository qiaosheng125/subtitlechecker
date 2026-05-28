"use client";

import { ChangeEvent, useMemo, useState } from "react";

type PresetKey = "general" | "netflix" | "bbc" | "custom";
type Severity = "error" | "warning" | "info";

type Cue = {
  index: number | null;
  order: number;
  start: number | null;
  end: number | null;
  timingLine: string;
  lines: string[];
  raw: string;
};

type Issue = {
  severity: Severity;
  cue: number;
  title: string;
  detail: string;
  fix: string;
};

type CheckResult = {
  cues: Cue[];
  issues: Issue[];
  totalDuration: number;
  longestLine: number;
  highestCps: number;
};

const presets: Record<
  PresetKey,
  {
    label: string;
    cpl: number;
    cps: number;
    maxLines: number;
    note: string;
  }
> = {
  general: {
    label: "General",
    cpl: 42,
    cps: 20,
    maxLines: 2,
    note: "A practical default for web video and social clips."
  },
  netflix: {
    label: "Netflix-style",
    cpl: 42,
    cps: 17,
    maxLines: 2,
    note: "A stricter readability preset inspired by common streaming subtitle guidance."
  },
  bbc: {
    label: "BBC-style",
    cpl: 37,
    cps: 17,
    maxLines: 2,
    note: "A tighter preset for more conservative subtitle line length."
  },
  custom: {
    label: "Custom",
    cpl: 42,
    cps: 20,
    maxLines: 2,
    note: "Set your own CPL and CPS limits."
  }
};

const sampleSrt = `1
00:00:01,000 --> 00:00:04,000
Welcome to this subtitle quality check.

2
00:00:04,200 --> 00:00:06,000
This line is intentionally far too long for a subtitle line and should be flagged by the checker.

3
00:00:05,900 --> 00:00:08,000
This cue overlaps the previous cue.

4
00:00:09,000 --> 00:00:10,000
Too many words are packed into one tiny second here.`;

function parseTimestamp(value: string): number | null {
  const match = value.trim().match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!match) {
    return null;
  }

  const [, hh, mm, ss, ms] = match;
  return (
    Number(hh) * 3600 + Number(mm) * 60 + Number(ss) + Number(ms) / 1000
  );
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0s";
  }

  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const parts = [];

  if (hours) {
    parts.push(`${hours}h`);
  }
  if (minutes) {
    parts.push(`${minutes}m`);
  }
  if (secs || parts.length === 0) {
    parts.push(`${secs}s`);
  }

  return parts.join(" ");
}

function parseSrt(input: string): Cue[] {
  const normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/\n{2,}/)
    .map((block, blockIndex) => {
      const rawLines = block.split("\n");
      const firstLine = rawLines[0]?.trim() ?? "";
      const hasIndex = /^\d+$/.test(firstLine);
      const timingLine = hasIndex
        ? rawLines[1]?.trim() ?? ""
        : rawLines[0]?.trim() ?? "";
      const textLines = (hasIndex ? rawLines.slice(2) : rawLines.slice(1)).map(
        (line) => line.trimEnd()
      );
      const [startRaw = "", endRaw = ""] = timingLine.split("-->");

      return {
        index: hasIndex ? Number(firstLine) : null,
        order: blockIndex + 1,
        start: parseTimestamp(startRaw),
        end: parseTimestamp(endRaw),
        timingLine,
        lines: textLines.filter((line) => line.trim().length > 0),
        raw: block
      };
    });
}

function checkSubtitles(
  input: string,
  config: { cpl: number; cps: number; maxLines: number }
): CheckResult {
  const cues = parseSrt(input);
  const issues: Issue[] = [];
  let totalDuration = 0;
  let longestLine = 0;
  let highestCps = 0;

  cues.forEach((cue, i) => {
    const cueLabel = cue.index ?? cue.order;

    if (cue.index === null) {
      issues.push({
        severity: "warning",
        cue: cueLabel,
        title: "Missing cue number",
        detail: "This block does not start with a numeric SRT cue number.",
        fix: "Add a numeric cue number before the timing line."
      });
    } else if (cue.index !== cue.order) {
      issues.push({
        severity: "warning",
        cue: cueLabel,
        title: "Cue number is not sequential",
        detail: `Expected cue number ${cue.order}, but found ${cue.index}.`,
        fix: "Renumber cues from top to bottom before publishing."
      });
    }

    if (!cue.timingLine.includes("-->") || cue.start === null || cue.end === null) {
      issues.push({
        severity: "error",
        cue: cueLabel,
        title: "Invalid timing format",
        detail: `Timing line "${cue.timingLine || "(missing)"}" is not valid SRT timing.`,
        fix: "Use HH:MM:SS,mmm --> HH:MM:SS,mmm format."
      });
    } else if (cue.end <= cue.start) {
      issues.push({
        severity: "error",
        cue: cueLabel,
        title: "End time is not after start time",
        detail: "The subtitle ends before or exactly when it starts.",
        fix: "Move the end time after the start time."
      });
    } else {
      const duration = cue.end - cue.start;
      totalDuration += duration;

      const text = cue.lines.join(" ");
      const cps = text.length / duration;
      highestCps = Math.max(highestCps, cps);

      if (duration < 0.6) {
        issues.push({
          severity: "warning",
          cue: cueLabel,
          title: "Very short display time",
          detail: `This cue is visible for only ${duration.toFixed(1)} seconds.`,
          fix: "Increase the subtitle duration or split nearby cues."
        });
      }

      if (cps > config.cps) {
        issues.push({
          severity: "warning",
          cue: cueLabel,
          title: "CPS is too high",
          detail: `This cue is ${cps.toFixed(1)} CPS, above your ${config.cps} CPS limit.`,
          fix: "Shorten the text, split the cue, or increase display time."
        });
      }

      const previous = cues[i - 1];
      if (
        previous?.end !== null &&
        previous?.end !== undefined &&
        cue.start !== null &&
        cue.start < previous.end
      ) {
        issues.push({
          severity: "error",
          cue: cueLabel,
          title: "Timing overlaps the previous cue",
          detail: "This cue starts before the previous cue has ended.",
          fix: "Move this start time later or shorten the previous cue."
        });
      }
    }

    if (cue.lines.length === 0) {
      issues.push({
        severity: "error",
        cue: cueLabel,
        title: "Empty subtitle text",
        detail: "This cue has timing but no subtitle text.",
        fix: "Add subtitle text or remove the empty cue."
      });
    }

    if (cue.lines.length > config.maxLines) {
      issues.push({
        severity: "warning",
        cue: cueLabel,
        title: "Too many subtitle lines",
        detail: `This cue has ${cue.lines.length} lines. Your limit is ${config.maxLines}.`,
        fix: "Rewrite or split the cue so it uses fewer lines."
      });
    }

    cue.lines.forEach((line, lineIndex) => {
      longestLine = Math.max(longestLine, line.length);

      if (line.length > config.cpl) {
        issues.push({
          severity: "warning",
          cue: cueLabel,
          title: "Line is too long",
          detail: `Line ${lineIndex + 1} has ${line.length} characters. Your limit is ${config.cpl}.`,
          fix: "Break the line earlier or shorten the sentence."
        });
      }
    });
  });

  if (!input.trim()) {
    issues.push({
      severity: "info",
      cue: 0,
      title: "No subtitle text yet",
      detail: "Paste or upload an SRT file to run the checker.",
      fix: "Use the sample button if you want to test the report."
    });
  } else if (cues.length === 0) {
    issues.push({
      severity: "error",
      cue: 0,
      title: "No SRT cues found",
      detail: "The text could not be parsed as SRT blocks.",
      fix: "Check that each block has a number, timing line, and subtitle text."
    });
  }

  return { cues, issues, totalDuration, longestLine, highestCps };
}

function buildAiPrompt(result: CheckResult, input: string): string {
  const issueLines = result.issues
    .filter((issue) => issue.severity !== "info")
    .slice(0, 60)
    .map(
      (issue) =>
        `- Cue ${issue.cue}: ${issue.title}. ${issue.detail} Fix: ${issue.fix}`
    )
    .join("\n");

  return `Please fix this SRT subtitle file. Keep the original meaning, preserve valid SRT timing where possible, and return only the corrected SRT.

Rules:
- Keep each subtitle line readable.
- Prefer no more than 2 lines per cue.
- Keep line length within the selected limit when possible.
- Reduce high CPS by shortening text, splitting cues, or suggesting timing changes.
- Fix numbering, empty cues, invalid timing, and overlaps.

Detected issues:
${issueLines || "- No major issues detected. Still review readability."}

SRT:
${input.trim()}`;
}

function HomeLink() {
  return (
    <a className="brand" href="/">
      <span className="brandMark" />
      <span>Subtitle Checker</span>
    </a>
  );
}

export default function Home() {
  const [text, setText] = useState(sampleSrt);
  const [preset, setPreset] = useState<PresetKey>("general");
  const [customCpl, setCustomCpl] = useState(42);
  const [customCps, setCustomCps] = useState(20);
  const [copied, setCopied] = useState<string | null>(null);

  const activePreset = presets[preset];
  const config = {
    cpl: preset === "custom" ? customCpl : activePreset.cpl,
    cps: preset === "custom" ? customCps : activePreset.cps,
    maxLines: activePreset.maxLines
  };
  const result = useMemo(() => checkSubtitles(text, config), [text, config.cpl, config.cps, config.maxLines]);
  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter((issue) => issue.severity === "warning");
  const score = Math.max(0, 100 - errors.length * 20 - warnings.length * 6);
  const aiPrompt = buildAiPrompt(result, text);

  function copy(value: string, label: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1800);
    });
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result ?? ""));
    };
    reader.readAsText(file);
  }

  return (
    <main>
      <header className="siteHeader">
        <nav className="nav">
          <HomeLink />
          <div className="navLinks">
            <a href="#checker">Tool</a>
            <a href="#guide">Guide</a>
            <a href="#faq">FAQ</a>
          </div>
        </nav>
      </header>

      <section className="hero" id="checker">
        <div className="heroText">
          <p className="eyebrow">SRT SUBTITLE CHECKER</p>
          <h1>Check subtitle quality before publishing.</h1>
          <p>
            Paste or upload an SRT file to find line length, CPS, timing,
            numbering, and readability issues. Everything runs in your browser.
          </p>
        </div>

        <section className="toolShell" aria-label="SRT subtitle checker">
          <div className="inputPanel">
            <div className="panelHeader">
              <div>
                <h2>Paste SRT</h2>
                <p>No upload. No account. Local browser check.</p>
              </div>
              <div className="toolActions">
                <label className="fileButton">
                  Upload .srt
                  <input
                    type="file"
                    accept=".srt,text/plain"
                    onChange={onFileChange}
                  />
                </label>
                <button type="button" onClick={() => setText(sampleSrt)}>
                  Sample
                </button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              spellCheck={false}
              aria-label="SRT subtitle input"
            />
          </div>

          <div className="settingsPanel">
            <div className="panelHeader compact">
              <div>
                <h2>Rules</h2>
                <p>{activePreset.note}</p>
              </div>
            </div>

            <div className="presetGrid" role="group" aria-label="Subtitle presets">
              {(Object.keys(presets) as PresetKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={preset === key ? "selected" : ""}
                  onClick={() => setPreset(key)}
                >
                  {presets[key].label}
                </button>
              ))}
            </div>

            <div className="limitsGrid">
              <label>
                CPL
                <input
                  type="number"
                  min={20}
                  max={80}
                  value={config.cpl}
                  disabled={preset !== "custom"}
                  onChange={(event) => setCustomCpl(Number(event.target.value))}
                />
              </label>
              <label>
                CPS
                <input
                  type="number"
                  min={8}
                  max={35}
                  value={config.cps}
                  disabled={preset !== "custom"}
                  onChange={(event) => setCustomCps(Number(event.target.value))}
                />
              </label>
            </div>

            <div className="summaryGrid">
              <div className="metric">
                <span>Score</span>
                <strong>{score}</strong>
              </div>
              <div className="metric">
                <span>Cues</span>
                <strong>{result.cues.length}</strong>
              </div>
              <div className="metric bad">
                <span>Errors</span>
                <strong>{errors.length}</strong>
              </div>
              <div className="metric warn">
                <span>Warnings</span>
                <strong>{warnings.length}</strong>
              </div>
            </div>

            <div className="smallStats">
              <span>Total subtitle time: {formatDuration(result.totalDuration)}</span>
              <span>Longest line: {result.longestLine} chars</span>
              <span>Highest CPS: {result.highestCps.toFixed(1)}</span>
            </div>
          </div>
        </section>
      </section>

      <section className="resultsBand" aria-label="Subtitle report">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">CHECK REPORT</p>
            <h2>Issues found in your subtitles</h2>
          </div>
          <div className="reportActions">
            <button type="button" onClick={() => copy(aiPrompt, "AI prompt")}>
              Copy AI fix prompt
            </button>
            <button
              type="button"
              onClick={() =>
                copy(
                  result.issues
                    .map(
                      (issue) =>
                        `Cue ${issue.cue}: ${issue.title} - ${issue.detail}`
                    )
                    .join("\n"),
                  "issues"
                )
              }
            >
              Copy issues
            </button>
          </div>
        </div>

        {copied ? <p className="copyNotice">{copied} copied.</p> : null}

        {errors.length === 0 && warnings.length === 0 && text.trim() ? (
          <div className="perfectBox">
            <strong>Clean pass.</strong>
            <span>Your subtitles are behaving unusually well today.</span>
          </div>
        ) : null}

        <div className="issueList">
          {result.issues.map((issue, index) => (
            <article className={`issueCard ${issue.severity}`} key={`${issue.cue}-${issue.title}-${index}`}>
              <div className="issueMeta">
                <span>{issue.severity}</span>
                <span>Cue {issue.cue}</span>
              </div>
              <h3>{issue.title}</h3>
              <p>{issue.detail}</p>
              <p className="fixText">{issue.fix}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contentBand" id="guide">
        <div className="contentGrid">
          <article>
            <h2>What does this subtitle checker look for?</h2>
            <p>
              This tool checks practical SRT readability problems before you
              publish subtitles on YouTube, course platforms, streaming previews,
              client review pages, or social video. It focuses on issues that are
              easy to miss when you only look at the subtitle text.
            </p>
            <p>
              CPL means characters per line. CPS means characters per second.
              A line can look fine in a text editor but feel too fast or too wide
              when it appears on a phone screen.
            </p>
          </article>
          <article>
            <h2>Why line length and CPS matter</h2>
            <p>
              Long subtitle lines force viewers to read instead of watch. High
              CPS means the subtitle disappears before the viewer can finish
              reading. These issues are common in AI-generated subtitles,
              translated subtitles, and copied transcript files.
            </p>
            <p>
              The checker does not replace a human subtitle review, but it gives
              you a fast first pass so obvious problems do not reach your editor,
              client, or audience.
            </p>
          </article>
        </div>
      </section>

      <section className="faqBand" id="faq">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2>Subtitle checking questions</h2>
          </div>
        </div>
        <div className="faqGrid">
          <article>
            <h3>Do you upload my subtitle file?</h3>
            <p>
              No. The first version runs in your browser. Your pasted SRT text
              or uploaded file is not sent to a server.
            </p>
          </article>
          <article>
            <h3>Does a clean report guarantee platform approval?</h3>
            <p>
              No. Platforms and clients may use their own subtitle rules. This
              checker helps catch common readability and timing issues, but you
              should still follow the final style guide for your project.
            </p>
          </article>
          <article>
            <h3>Can I use this for VTT or ASS subtitles?</h3>
            <p>
              This version is built for SRT. VTT and ASS support can be added
              later if users need it.
            </p>
          </article>
          <article>
            <h3>What should I do with the AI fix prompt?</h3>
            <p>
              Copy it into your AI assistant together with your subtitle file.
              Ask it to return corrected SRT only, then review the result before
              publishing.
            </p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <HomeLink />
        <div>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
        </div>
      </footer>
    </main>
  );
}
