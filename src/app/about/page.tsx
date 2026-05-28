import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Subtitle Checker, a browser-based SRT subtitle quality checker for line length, CPS, timing, and readability issues.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <main className="plainPage">
      <a className="brand" href="/">
        <span className="brandMark" />
        <span>Subtitle Checker</span>
      </a>
      <section>
        <h1>About Subtitle Checker</h1>
        <p>
          Subtitle Checker is a small browser-based tool for reviewing SRT
          subtitle files before publishing. It checks practical quality issues
          such as line length, CPS, timing overlap, empty cues, and numbering.
        </p>
        <p>
          The goal is not to replace a human subtitle editor. The goal is to
          catch obvious formatting and readability problems early, before a file
          reaches a client, editor, course platform, or video audience.
        </p>
        <p>
          The first version runs locally in the browser. Your pasted subtitle
          text is not uploaded to a server.
        </p>
      </section>
    </main>
  );
}
