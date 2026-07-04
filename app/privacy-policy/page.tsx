import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How InstaGrab handles your data — spoiler: we collect almost nothing.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="page">
      <h1>Privacy Policy</h1>
      <p>Last updated: July 4, 2026</p>

      <h2>The short version</h2>
      <p>
        InstaGrab requires no account, no login, and no personal information.
        We do not store the links you paste, and we do not store any downloaded
        media on our servers.
      </p>

      <h2>What we process</h2>
      <ul>
        <li>
          <strong>Instagram URLs you paste:</strong> sent to our server only to
          fetch the public media and caption from Instagram, then discarded.
          They are not saved to any database.
        </li>
        <li>
          <strong>IP address:</strong> used transiently for rate limiting
          (preventing abuse) and appears in standard hosting logs kept by our
          hosting provider for a limited period.
        </li>
        <li>
          <strong>Anonymous analytics:</strong> we may use privacy-friendly,
          aggregate analytics (page views, country) to understand traffic. No
          personal profiles are built.
        </li>
      </ul>

      <h2>Cookies and advertising</h2>
      <p>
        InstaGrab is supported by advertising. Ad networks (such as Adsterra or
        Monetag) may use cookies or similar technologies to serve and measure
        ads. These third parties have their own privacy policies governing the
        data they collect. You can control cookies through your browser
        settings.
      </p>

      <h2>Your Instagram account</h2>
      <p>
        We never ask for, receive, or store Instagram usernames or passwords.
        InstaGrab only accesses content that Instagram serves publicly.
      </p>

      <h2>Children</h2>
      <p>
        InstaGrab is not directed at children under 13 and we do not knowingly
        collect information from them.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy; the &quot;last updated&quot; date will change
        accordingly. Continued use of the site means you accept the current
        policy.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions? Reach us via the contact page.
      </p>
    </main>
  );
}
