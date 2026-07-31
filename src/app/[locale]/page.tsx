import { getTranslations, setRequestLocale } from "next-intl/server";
import { CountUp } from "@/components/count-up";
import { HeroTitle } from "@/components/hero-title";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { MotionLink } from "@/components/motion-link";
import { TiltCard } from "@/components/tilt-card";
import { TrailBackdrop } from "@/components/trail-backdrop";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getAllModels, getProviders } from "@/data/models";
import { cn } from "@/lib/utils";

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
      status: t("statusInProgress"),
      inProgress: true,
      live: false,
      body: t("phases.applyBody"),
      href: "/apply" as const,
      linkLabel: t("phases.applyLink"),
    },
    {
      phase: "Phase 3",
      name: t("phases.learnName"),
      status: t("statusInProgress"),
      inProgress: true,
      live: false,
      body: t("phases.learnBody"),
      href: "/guide" as const,
      linkLabel: t("phases.learnLink"),
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
          <Badge variant="outline" className="gap-2 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {t("badge")}
          </Badge>
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
            className={cn(buttonVariants({ size: "lg" }), "btn-shimmer")}
          >
            {t("exploreCta")}
          </MotionLink>
          <MotionLink
            href="/compare"
            className={buttonVariants({ variant: "outline", size: "lg" })}
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
            <TiltCard className="h-full">
              <Card className="group h-full border-line bg-surface transition-colors hover:border-accent/40 hover:bg-surface-raised">
                <CardHeader className="p-6 pb-0">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <CardDescription>{card.body}</CardDescription>
                </CardContent>
              </Card>
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
                <Badge
                  variant={
                    step.live || step.inProgress ? "default" : "outline"
                  }
                  className="text-[11px]"
                >
                  {step.status}
                </Badge>
              </div>
              <h3 className="mt-1.5 text-lg font-semibold">{step.name}</h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                {step.body}
              </p>
              {"href" in step && step.href ? (
                <Link
                  href={step.href}
                  className="mt-2 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
                >
                  {step.linkLabel} →
                </Link>
              ) : null}
            </FadeIn>
          ))}
        </ol>
      </section>

      <FadeIn className="pb-20">
        <Card className="border-accent/25 bg-accent-soft/40 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Phase 1 · Choose
              </p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                {t("exploreCta")}
              </h2>
              <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <MotionLink
                href="/models"
                className={cn(buttonVariants({ size: "default" }), "btn-shimmer")}
              >
                {t("exploreCta")} →
              </MotionLink>
              <MotionLink
                href="/guide"
                className={cn(buttonVariants({ size: "default", variant: "outline" }))}
              >
                {t("guideCta")} →
              </MotionLink>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
