"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";
import { cn } from "@/lib/utils";
import { getPanelUrl } from "@/lib/panelUrl";

export default function RehamDivaShowcase() {
  const { t, locale } = useTranslation();
  const isRTL = locale === "ar";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoaded = () => setIsLoaded(true);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("loadeddata", onLoaded);
    if (v.muted) {
      v.play().catch(() => setIsPlaying(false));
    }
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("loadeddata", onLoaded);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const handleStartJourneyClick = () => {
    if (typeof window === "undefined") return;
    window.location.href = getPanelUrl(locale);
  };
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full  sm:object-cover"
      >
        <Card className="relative w-full max-w-none shadow-2xl border-0 bg-transparent overflow-hidden rounded-none h-[420px] sm:h-[520px] md:h-[620px] lg:h-[780px]">
          {/* Background video */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              className="w-full h-full object-cover object-center"
              muted
              playsInline
              autoPlay
              loop
              poster="/images/hero.png"
            >
              <source src="/images/hero/full.mp4" type="video/mp4" />
            </video>
            {/* Dim overall + fade-left so video emphasis is right */}
            <div className="pointer-events-none absolute inset-0 bg-black/25" />
            <div
              className={cn(
                "pointer-events-none absolute inset-0 from-transparent via-black/50",
                isRTL
                  ? "bg-gradient-to-r to-black/80"
                  : "bg-gradient-to-l to-black/80"
              )}
            />
            {!isLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-black/10 via-transparent to-black/10" />
            )}
          </div>

          {/* Play/Pause control */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={
              isPlaying ? "Pause background video" : "Play background video"
            }
          aria-pressed={!isPlaying}
          className={cn(
            "absolute inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md ring-1 ring-white/40 hover:bg-white/40 transition z-20",
            "top-3 sm:top-auto sm:bottom-4",
            isRTL ? "right-4" : "right-4"
          )}
        >
            {isPlaying ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Foreground content */}
          <div className="relative z-10 h-full w-full px-6 sm:px-10 lg:px-16 py-6 sm:py-10 lg:py-16">
            <div
              className={cn(
                "flex h-full w-full items-end",
                isRTL ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-2xl space-y-6",
                  isRTL ? "ml-auto text-right" : "mr-auto text-left"
                )}
              >
                <div className="space-y-4">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                    {t("instructors.meetGuide")}
                  </h3>
                  <p className="text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl">
                    {t("instructors.startJourney")}
                  </p>
                </div>

                <div className="space-y-3 text-white/90">
                  <p className="text-lg sm:text-xl font-semibold">
                    {t("instructors.rehamDiva")}
                  </p>
                  <p className="text-white/85 text-sm sm:text-base leading-relaxed italic">
                    &ldquo;{t("instructors.quote")}&rdquo;
                  </p>
                </div>

                <div
                  className={cn(
                    "grid grid-cols-2 gap-2 pt-2",
                    isRTL ? "sm:flex-row-reverse" : "",
                    "items-center justify-start"
                  )}
                >
                  <Button
                    size="lg"
                    className="bg-pink-500 hover:bg-pink-700 text-white px-2 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleStartJourneyClick}
                  >
                    {t("instructors.startJourneyBtn")}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/70 text-white hover:bg-white/10 px-2 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300"
                    asChild
                  >
                    <Link
                      className="flex items-center"
                      href={`/${locale}/courses`}
                    >
                      {t("instructors.explorePrograms")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
