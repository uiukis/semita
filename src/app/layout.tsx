import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3100";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
