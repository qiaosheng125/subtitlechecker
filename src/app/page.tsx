import type { Metadata } from "next";
import SubtitleCheckerApp from "./SubtitleCheckerApp";

export const metadata: Metadata = {
  alternates: {
    canonical: "/"
  }
};

export default function HomePage() {
  return <SubtitleCheckerApp />;
}
