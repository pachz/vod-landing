"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

export default function RehamDivaShowcase() {
  const { t, locale } = useTranslation();
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
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full  sm:object-cover"
      >
        <Card className="relative w-full max-w-none shadow-2xl border-0 bg-transparent overflow-hidden rounded-none">
          {/* Background video */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              className="h-full w-full object-cover sm:object-right object-center"
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
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-black/50 to-black/80" />
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
            className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md ring-1 ring-white/40 hover:bg-white/40 transition z-20"
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
          <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-20 min-h-[420px] flex items-center">
            <div className="max-w-2xl">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                {t("instructors.meetGuide")}
              </h3>
              <p className="text-white/90 text-lg sm:text-xl mt-3 sm:mt-4 max-w-xl">
                {t("instructors.startJourney")}
              </p>

              <div className="mt-8 space-y-4 text-white/95">
                <p className="text-xl font-semibold">
                  {t("instructors.rehamDiva")}
                </p>
                <p className="text-white/85 text-sm leading-relaxed italic">
                  &ldquo;{t("instructors.quote")}&rdquo;
                </p>
                <p className="text-white/85 text-sm leading-relaxed">
                  {t("instructors.description1")}
                </p>
                <p className="text-white/85 text-sm leading-relaxed">
                  {t("instructors.description2")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  size="lg"
                  className="bg-pink-500 hover:bg-pink-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {t("instructors.startJourneyBtn")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/70 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium transition-all duration-300"
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
        </Card>
      </motion.div>
    </div>
  );
}
