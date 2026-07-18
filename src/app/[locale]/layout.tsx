import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3100";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: "%s · Semita",
    },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "pt-BR": "/pt-br",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "pt-br" ? "pt_BR" : "en_US",
      url: `/${locale}`,
      siteName: "Semita",
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M3 21C8 21 8 13 13 13C18 13 18 5 23 5"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
          className="animate-trail"
        />
        <circle cx="3" cy="21" r="2.5" fill="var(--accent)" />
        <circle cx="23" cy="5" r="2.5" fill="var(--foreground)" />
      </svg>
      <span className="text-lg font-semibold tracking-tight">semita</span>
    </span>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations("nav");
  const tf = await getTranslations("footer");

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <header className="sticky top-0 z-20 border-b border-line bg-background/75 backdrop-blur-md">
            <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
              <Link href="/" aria-label={t("home")}>
                <Wordmark />
              </Link>
              <div className="flex items-center gap-1 text-sm">
                <Link
                  href="/models"
                  className="rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
                >
                  {t("models")}
                </Link>
                <Link
                  href="/compare"
                  className="rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
                >
                  {t("compare")}
                </Link>
                <span className="ml-1">
                  <Suspense fallback={null}>
                    <LanguageSwitcher />
                  </Suspense>
                </span>
              </div>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-line py-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span>{tf("tagline")}</span>
              <span className="text-xs">{tf("disclaimer")}</span>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
