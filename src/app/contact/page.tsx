import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Subtitle Checker for bug reports, subtitle checking suggestions, and feature requests.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <main className="plainPage">
      <a className="brand" href="/">
        <span className="brandMark" />
        <span>Subtitle Checker</span>
      </a>
      <section>
        <h1>Contact</h1>
        <p>
          For bug reports or feature requests, open an issue in the project
          repository after the public GitHub repository is connected.
        </p>
        <p>
          Useful reports include the subtitle format, the expected result, and a
          short sample that reproduces the problem. Do not share private client
          subtitles unless you have permission to do so.
        </p>
      </section>
    </main>
  );
}
