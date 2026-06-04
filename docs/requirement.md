# Requirement: Subtitle Checker

## Product Definition

Subtitle Checker is a browser-based SRT subtitle quality checker for creators, editors, translators, and video operators who need to catch readability and format issues before publishing or delivery.

## User

- YouTube creators.
- Subtitle editors.
- Video editors.
- Translators.
- Course and tutorial producers.

## Scenario

The user has an `.srt` subtitle file or pasted SRT text and wants to know whether it has obvious delivery problems before uploading it to YouTube, a client workflow, or another publishing platform.

## Desired Result

The user should get a clear local report that shows:

- Line length issues.
- Characters-per-second issues.
- Timing overlaps.
- Invalid timing format.
- Empty cues.
- Cue numbering problems.
- Too many subtitle lines.
- Very short display duration.
- Actionable repair suggestions.

## MVP

The first version includes:

- SRT paste input.
- SRT file upload.
- Platform-style presets.
- Browser-only processing.
- Issue summary.
- Issue table.
- Score and warnings.
- Copyable AI repair prompt.
- About, Contact, Privacy, robots, sitemap, canonical, and OG metadata.
- GA4 and Microsoft Clarity hooks through environment variables.

## Non-Goals

- No video upload.
- No subtitle editor timeline.
- No automatic AI translation.
- No official Netflix, BBC, YouTube, or client compliance guarantee.
- No server-side storage of subtitle files.

## Success Criteria

- User can get a useful report within 3 steps.
- Homepage exposes the working tool in the first viewport.
- Example content and FAQ support indexing.
- `sitemap.xml`, `robots.txt`, canonical, and OG metadata use the production domain.
- GSC, Bing, GA4, and Clarity are connected before L0 is considered complete.
