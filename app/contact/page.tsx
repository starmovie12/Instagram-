import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the InstaGrab team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="page">
      <h1>Contact Us</h1>
      <p>
        Questions, feedback, bug reports, or business inquiries — we read
        everything.
      </p>
      <h2>Email</h2>
      <p>
        📧 <a href="mailto:starmovienight@gmail.com">starmovienight@gmail.com</a>
      </p>
      <h2>Common topics</h2>
      <ul>
        <li>
          <strong>Tool not working?</strong> Instagram rotates its internals
          every few weeks; we usually patch within hours. Try again a bit later
          or email us the link that failed.
        </li>
        <li>
          <strong>Copyright concerns:</strong> see the{" "}
          <Link href="/dmca">DMCA page</Link> for the fastest handling.
        </li>
        <li>
          <strong>Feature requests:</strong> tell us what would make InstaGrab
          more useful for you.
        </li>
      </ul>
      <p>We aim to reply within 48 hours.</p>
    </main>
  );
}
