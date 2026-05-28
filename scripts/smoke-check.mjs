const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";

async function assertOk(path, expectedText) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  const text = await response.text();
  if (expectedText && !text.includes(expectedText)) {
    throw new Error(`${path} did not include expected text: ${expectedText}`);
  }
  return text;
}

async function main() {
  const homepage = await assertOk("/", "SRT Subtitle Checker");
  const checks = [
    "Check subtitle quality before publishing.",
    "Copy AI fix prompt",
    "Line is too long",
    "CPS is too high",
    "Timing overlaps the previous cue",
    "What does this subtitle checker look for?"
  ];

  for (const check of checks) {
    if (!homepage.includes(check)) {
      throw new Error(`Homepage missing: ${check}`);
    }
  }

  await assertOk("/about", "About Subtitle Checker");
  await assertOk("/contact", "Contact");
  await assertOk("/privacy", "Privacy");
  await assertOk("/robots.txt", "https://www.subtitlechecker.com/sitemap.xml");
  await assertOk("/sitemap.xml", "https://www.subtitlechecker.com/");

  console.log("Smoke check passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
