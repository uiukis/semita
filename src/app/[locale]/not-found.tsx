import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion";
import { MotionLink } from "@/components/motion-link";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-start px-4 py-24 sm:px-6">
      <FadeIn>
        <p className="font-mono text-sm uppercase tracking-widest text-accent">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-lg text-muted">{t("body")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <MotionLink
            href="/"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#06130a]"
          >
            {t("home")}
          </MotionLink>
          <MotionLink
            href="/models"
            className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold"
          >
            {t("models")}
          </MotionLink>
        </div>
      </FadeIn>
    </div>
  );
}
