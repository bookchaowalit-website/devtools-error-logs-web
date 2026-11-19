import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// The font variable sits on <html>: the Dashboard shell tokens live on :root and read it from there.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const description = "A sample triage board for client error signals: a time window, status counts and the signal trail. No live data.";

export const metadata: Metadata = {
  title: "Error Logs | Bookchaowalit",
  description,
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  metadataBase: new URL("https://error-logs.bookchaowalit.com"),
  alternates: { canonical: "/" },
  openGraph: { type: "website", title: "Error Logs | Bookchaowalit", description, siteName: "Bookchaowalit" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
