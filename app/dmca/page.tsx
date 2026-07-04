import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA / Copyright Policy",
  description: "How to report copyright concerns related to InstaGrab.",
  alternates: { canonical: "/dmca" },
};

export default function DmcaPage() {
  return (
    <main className="page">
      <h1>DMCA / Copyright Policy</h1>
      <p>Last updated: July 4, 2026</p>

      <h2>We host no content</h2>
      <p>
        InstaGrab does not store, host, or redistribute any photos or videos.
        When a user pastes a link, media is fetched directly from
        Instagram&apos;s public servers and streamed to that user&apos;s device. No
        copies remain on our infrastructure.
      </p>
      <p>
        Because of this, removing content from Instagram itself (via
        Instagram&apos;s own reporting tools) automatically makes it unavailable
        through InstaGrab as well.
      </p>

      <h2>Reporting a concern</h2>
      <p>
        If you believe InstaGrab is being used to infringe your copyright, or
        you have another rights-related concern, email us with:
      </p>
      <ul>
        <li>Your name and contact information</li>
        <li>Identification of the copyrighted work</li>
        <li>The Instagram URL(s) involved</li>
        <li>A statement that you are the rights holder or authorized to act for them</li>
      </ul>
      <p>
        📧 <a href="mailto:starmovienight@gmail.com">starmovienight@gmail.com</a>{" "}
        (subject: &quot;DMCA&quot;)
      </p>
      <p>We take valid reports seriously and respond promptly.</p>

      <h2>Our stance</h2>
      <p>
        InstaGrab is a utility, like a browser&apos;s save function. We tell every
        user, on every page: download only content you own or have permission
        to use. Misuse of the tool is against our{" "}
        <a href="/terms">Terms of Service</a>.
      </p>
    </main>
  );
}
