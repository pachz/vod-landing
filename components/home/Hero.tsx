"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/useTranslation";
import { getPanelUrl } from "@/lib/panelUrl";

export default function Hero() {
  const { t, locale } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Video autoplay and play/pause state sync
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoaded = () => setIsLoaded(true);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("loadeddata", onLoaded);

    // Try autoplay if muted
    if (v.muted) {
      v.play().catch(() => {
        // Autoplay may still be blocked; leave button to start
        setIsPlaying(false);
      });
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
    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  };

  const panelUrl = getPanelUrl(locale);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center px-4 pb-12 sm:pb-16 pt-24 sm:pt-28 lg:pt-32 min-h-[calc(100vh-4rem)] overflow-hidden"
    >
      {/* Premium Background */}
      <div className="absolute inset-0 bg-white">
        {/* Subtle purple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/6 via-transparent to-transparent"></div>

        {/* Noise texture layer */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          ></div>
        </div>

        {/* Decorative pattern - positioned based on language */}
        <Image
          src="/images/RehamDivaSinglePattern.png"
          alt="Decorative pattern"
          width={600}
          height={600}
          className={`absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] opacity-30 sm:opacity-60 pointer-events-none object-contain hidden sm:block ${
            locale === "ar"
              ? "bottom-0 left-0 object-bottom object-left rotate-90"
              : "bottom-0 right-0 object-bottom object-right"
          }`}
          sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 600px"
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left Column - Text Content */}
          <div
            className={`flex flex-col justify-center space-y-6 sm:space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Main Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-purple-900 leading-tight">
                {t("hero.title")}
              </h1>
              <p className="text-lg sm:text-xl text-purple-700 leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 max-w-xl">
              <Button
                size="lg"
                className="bg-[rgb(236,72,153)] hover:bg-[rgb(190,24,93)] text-white w-full sm:w-auto"
                asChild
              >
                <Link
                  className="flex w-full items-center justify-center"
                  href={`/${locale}/courses`}
                >
                  {t("hero.exploreAll")}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white w-full sm:w-auto "
                asChild
              >
                <Link
                  className="flex w-full items-center justify-center"
                  href={panelUrl}
                >
                  {t("hero.subscribeNow")}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Video */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            } flex justify-center lg:justify-end`}
          >
            <div className="relative aspect-[9/16] w-full max-w-[min(340px,85vw)] sm:max-w-[360px] lg:max-w-[380px] overflow-hidden rounded-[28px] shadow-2xl shadow-purple-900/20">
              <div className="relative h-full w-full" onClick={togglePlay}>
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  muted
                  playsInline
                  autoPlay
                  loop
                  poster="/images/hero.png"
                >
                  {/* Provide both formats if available */}
                  <source src="/images/hero/hero.mp4" type="video/mp4" />
                </video>

                {/* Soft overlay gradient for readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />

                {/* Loading shimmer while video loads */}
                {!isLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10" />
                )}

                {/* Play/Pause button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-purple-700 shadow-lg ring-1 ring-black/5 hover:bg-white transition"
                >
                  {isPlaying ? (
                    // Pause icon
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                      <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                    </svg>
                  ) : (
                    // Play icon
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
