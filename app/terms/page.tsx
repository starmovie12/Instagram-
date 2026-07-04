import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules for using InstaGrab.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="page">
      <h1>Terms of Service</h1>
      <p>Last updated: July 4, 2026</p>

      <h2>1. What InstaGrab is</h2>
      <p>
        InstaGrab is a free tool that lets you download publicly available
        Instagram media and extract its caption, hashtags, and mentions. We do
        not host, store, or redistribute any content — media is fetched from
        Instagram&apos;s public servers at your request.
      </p>

      <h2>2. Acceptable use</h2>
      <ul>
        <li>Only download content you own, have permission to use, or are saving for personal offline viewing.</li>
        <li>Do not use InstaGrab to infringe copyright, harass anyone, or violate Instagram&apos;s own terms.</li>
        <li>Do not attempt to access private accounts or non-public content.</li>
        <li>No automated/bulk scraping of this service — rate limits are enforced.</li>
      </ul>

      <h2>3. Intellectual property</h2>
      <p>
        All content downloaded through InstaGrab belongs to its respective
        owners. InstaGrab claims no ownership of any Instagram content.
        InstaGrab is not affiliated with, endorsed by, or sponsored by
        Instagram™ or Meta Platforms, Inc.
      </p>

      <h2>4. Copyright complaints</h2>
      <p>
        Rights holders can request removal assistance via our{" "}
        <Link href="/dmca">DMCA page</Link>. Note that we host no content, so
        takedowns of the underlying media must be directed to Instagram.
      </p>

      <h2>5. No warranty</h2>
      <p>
        The service is provided &quot;as is&quot;, without warranties of any kind.
        Instagram changes its systems frequently; the tool may occasionally be
        unavailable or stop working until patched.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, InstaGrab is not liable for any
        damages arising from your use of the service, including your use of any
        downloaded content.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may modify these terms at any time. Continued use after changes
        constitutes acceptance.
      </p>
    </main>
  );
}
