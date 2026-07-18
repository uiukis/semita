import { getTranslations, setRequestLocale } from "next-intl/server";
import { CountUp } from "@/components/count-up";
import { HeroTitle } from "@/components/hero-title";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { MotionLink } from "@/components/motion-link";
import { TiltCard } from "@/components/tilt-card";
import { TrailBackdrop } from "@/components/trail-backdrop";
import { getAllModels, getProviders } from "@/data/models";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const models = getAllModels();
  const providers = getProviders();

  const features = [
    { title: t("features.costTitle"), body: t("features.costBody") },
    { title: t("features.contextTitle"), body: t("features.contextBody") },
    { title: t("features.communityTitle"), body: t("features.communityBody") },
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      name: t("phases.chooseName"),
      status: t("statusLive"),
      inProgress: false,
      live: true,
      body: t("phases.chooseBody"),
    },
    {
      phase: "Phase 2",
      name: t("phases.applyName"),
      status: t("statusPlanned"),
      inProgress: false,
      live: false,
      body: t("phases.applyBody"),
    },
    {
      phase: "Phase 3",
      name: t("phases.learnName"),
      status: t("statusPlanned"),
      inProgress: false,
      live: false,
      body: t("phases.learnBody"),
    },
    {
      phase: "Phase 4",
      name: t("phases.validateName"),
      status: t("statusPlanned"),
      inProgress: false,
      live: false,
      body: t("phases.validateBody"),
    },
  ];

  const stats = [
    { value: models.length, suffix: "", label: t("statModels") },
    { value: providers.length, suffix: "", label: t("statProviders") },
    { value: 100, suffix: "%", label: t("statOpenSource") },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <section className="relative flex flex-col items-start gap-7 overflow-hidden py-20 sm:py-28 lg:py-36">
        <TrailBackdrop />

        <FadeIn delay={0} className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {t("badge")}
          </span>
        </FadeIn>

        <div className="relative z-10">
          <HeroTitle
            lead={t("titleLead")}
            accent={t("titleAccent")}
            tail={t("titleTail")}
            className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          />
        </div>

        <FadeIn delay={0.16} className="relative z-10">
          <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {t("subtitle")}
          </p>
        </FadeIn>

        <FadeIn delay={0.24} className="relative z-10 flex flex-wrap gap-3">
          <MotionLink
            href="/models"
            className="btn-shimmer rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#06130a] transition-colors hover:bg-accent-dim hover:shadow-lg hover:shadow-accent/20"
          >
            {t("exploreCta")}
          </MotionLink>
          <MotionLink
            href="/compare"
            className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:border-accent/40 hover:bg-surface-raised"
          >
            {t("compareCta")}
          </MotionLink>
        </FadeIn>

        <FadeIn delay={0.32} className="relative z-10">
          <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl font-semibold text-foreground">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </dt>
                <dd className="text-xs uppercase tracking-wider text-muted">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </section>

      <Stagger className="grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((card, index) => (
          <StaggerItem key={card.title} className="h-full">
            <TiltCard className="group relative h-full rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/40 hover:bg-surface-raised">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <span className="text-sm font-bold">{index + 1}</span>
              </div>
              <h2 className="text-base font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {card.body}
              </p>
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>

      <section className="pb-24">
        <FadeIn className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("roadmapTitle")}
          </h2>
          <p className="mt-2 text-muted">{t("roadmapSubtitle")}</p>
        </FadeIn>

        <ol className="relative space-y-8 border-l border-line pl-6 sm:space-y-10 sm:pl-8">
          {roadmap.map((step, index) => (
            <FadeIn
              key={step.phase}
              as="li"
              delay={index * 0.08}
              className="relative"
            >
              <span
                className={[
                  "absolute -left-[31px] top-1 flex h-3 w-3 rounded-full sm:-left-[39px]",
                  step.live || step.inProgress
                    ? "bg-accent shadow-[0_0_12px_var(--accent)]"
                    : "border border-line bg-surface",
                ].join(" ")}
              >
                {(step.live || step.inProgress) && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
                )}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  {step.phase}
                </span>
                <span
                  className={[
                    "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                    step.live || step.inProgress
                      ? "bg-accent-soft text-accent"
                      : "border border-line text-muted",
                  ].join(" ")}
                >
                  {step.status}
                </span>
              </div>
              <h3 className="mt-1.5 text-lg font-semibold">{step.name}</h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </FadeIn>
          ))}
        </ol>
      </section>

      <FadeIn className="pb-20">
        <div className="rounded-2xl border border-accent/25 bg-accent-soft/40 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Phase 1 · Choose
            </p>
            <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
              {t("exploreCta")}
            </h2>
            <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>
          </div>
          <MotionLink
            href="/models"
            className="btn-shimmer mt-5 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#06130a] transition-colors hover:bg-accent-dim sm:mt-0"
          >
            {t("exploreCta")} →
          </MotionLink>
        </div>
      </FadeIn>
    </div>
  );
}
