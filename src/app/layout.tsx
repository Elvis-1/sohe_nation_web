import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const headingFont = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-supporting",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Sohe's Nation",
    template: "%s | Sohe's Nation",
  },
  description:
    "Premium campaign-led fashion commerce for Sohe's Nation. Built like an army, styled like a headline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-[var(--color-surface-base)] text-[var(--color-text-primary)] antialiased"
      >
        <div className="relative flex min-h-screen flex-col overflow-x-clip">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,165,72,0.16),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(244,208,119,0.12),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_16%)]" />
          {children}
        </div>
      </body>
    </html>
  );
}
