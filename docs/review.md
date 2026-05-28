# Subtitle Checker Review

## Current Status

- Date: 2026-05-29
- Domain: `subtitlechecker.com`
- Local project: `03_网站项目/003_subtitle-checker`
- Stage: local development preview
- Local preview: `http://localhost:3002`

## Decision

Third site is based on a concrete pain point instead of a random keyword:

Users who create or edit subtitles need to know whether an SRT file has line length, CPS, timing, numbering, and readability issues before publishing.

## MVP

The first version checks:

- CPL: characters per line.
- CPS: characters per second.
- More than two subtitle lines.
- Timing overlaps.
- Invalid timing format.
- Empty cues.
- Cue numbering problems.
- Very short display duration.

It also provides:

- SRT paste input.
- SRT file upload.
- Platform-style presets.
- Issue report.
- AI fix prompt copy button.
- Local browser processing.

## Important Boundaries

- This is not a full subtitle editor.
- This is not an AI translation tool.
- This does not upload video.
- This does not guarantee official Netflix, BBC, YouTube, or client approval.
- The tool should explain issues clearly and help users fix obvious subtitle quality problems.

## Lessons Applied From Site 1 And 2

- First viewport must expose the actual tool.
- Homepage cannot be only a thin input box; guide and FAQ content are included for indexing.
- About, Contact, Privacy, robots, sitemap, canonical, and OG image are included from the start.
- Analytics hooks are environment-variable based.
- Copyable AI repair prompt is included because the user wants tools that work well with AI assistants.
