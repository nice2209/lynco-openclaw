import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lynco | Lead-to-Cash Flow Automation",
  description:
    "Connect quotes, approvals, contracts, invoices, payments, and reconciliation in one automated flow.",
  openGraph: {
    title: "Lynco | Lead-to-Cash Flow Automation",
    description:
      "Connect quotes, approvals, contracts, invoices, payments, and reconciliation in one automated flow.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
