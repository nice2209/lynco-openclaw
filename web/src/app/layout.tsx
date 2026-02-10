import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lynco | Automated Revenue Operations",
  description:
    "Connect quotes, approvals, contracts, invoices, payments, and reconciliation in one automated flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
