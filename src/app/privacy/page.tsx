import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy notes for Subtitle Checker, including local subtitle processing and optional analytics.",
  alternates: {
    canonical: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <main className="plainPage">
      <a className="brand" href="/">
        <span className="brandMark" />
        <span>Subtitle Checker</span>
      </a>
      <section>
        <h1>Privacy</h1>
        <p>
          Subtitle Checker is designed to process SRT text in your browser. The
          first version does not upload your pasted subtitle content to a server.
        </p>
        <p>
          The site may use privacy-friendly product analytics such as Google
          Analytics and Microsoft Clarity after deployment. These tools help
          understand usage patterns and improve the checker.
        </p>
        <p>
          Do not paste confidential or client-owned subtitle files into any web
          tool unless your workflow allows it.
        </p>
      </section>
    </main>
  );
}
