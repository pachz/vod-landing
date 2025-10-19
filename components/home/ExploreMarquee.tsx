"use client";

import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { courses } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/useTranslation";
import { Video } from "@/components/course";

// Component props interface
export interface ExploreMarqueeProps {
  videos: Video[];
  categories: string[];
  initialCategory?: string;
  onCategoryChange?: (category: string) => void;
  onViewAllClick?: () => void;
  viewAllRoute?: string;
  marqueeSpeed?: number;
  reduceMotionFallback?: boolean;
  onCourseClick?: (videoId: string) => void;
}

interface CarouselItem {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  duration: string;
  category: string;
  image: string;
}

interface CourseCardProps {
  course: CarouselItem;
  byLabel: string;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  byLabel,
  className,
}) => {
  return (
    <Card
      className={cn(
        "relative w-[280px] sm:w-[360px] lg:w-[420px] h-[160px] sm:h-[190px] lg:h-[220px] overflow-hidden cursor-pointer transition-transform duration-300 ease-out group rounded-3xl",
        className
      )}
    >
      <div className="relative h-full">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs bg-pink-500/20 text-pink-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-pink-500/30">
              {course.category}
            </span>
            <span className="text-[10px] sm:text-xs text-white/80">
              {course.duration}
            </span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base leading-tight mb-1 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-white/85 line-clamp-1">
            {byLabel} {course.instructor}
          </p>
        </div>
      </div>
    </Card>
  );
};

const ExploreMarquee: React.FC<ExploreMarqueeProps> = ({
  marqueeSpeed = 30,
  reduceMotionFallback = false,
  viewAllRoute = "/videos",
  onViewAllClick,
}) => {
  const { t, locale } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const translatedCarousel = t("explore.carousel");
  const translatedCategories = t("explore.categories") as
    | Record<string, string>
    | undefined;
  const byLabel = t("explore.by");

  const fallbackCourses: CarouselItem[] = courses.map((course) => {
    const categoryLabel =
      translatedCategories?.[course.category] ?? course.category;

    const isArabic = locale === "ar";
    return {
      id: course.id,
      title: isArabic && course.titleAr ? course.titleAr : course.title,
      description:
        isArabic && course.descriptionAr
          ? course.descriptionAr
          : course.description,
      instructor:
        isArabic && course.instructorAr
          ? course.instructorAr
          : course.instructor,
      duration:
        isArabic && course.durationAr ? course.durationAr : course.duration,
      category: categoryLabel,
      image: course.image,
    };
  });

  const carouselItems: CarouselItem[] =
    Array.isArray(translatedCarousel) && translatedCarousel.length > 0
      ? (translatedCarousel as CarouselItem[])
      : fallbackCourses;

  const baseSpeed = isMobile ? 40 : marqueeSpeed;
  const shouldReduceMotion = prefersReducedMotion || reduceMotionFallback;
  const isRTL = locale === "ar";

  const handleViewAll = () => {
    if (onViewAllClick) {
      onViewAllClick();
      return;
    }
    if (typeof window !== "undefined") {
      window.location.href = viewAllRoute;
    }
  };

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: "performance",
    mode: "free",
    rubberband: false,
    rtl: isRTL,
    slides: {
      origin: "auto",
      perView: 3.25,
      spacing: 4,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 2.25, spacing: 4 },
      },
      "(max-width: 640px)": {
        slides: { perView: 1.25, spacing: 4 },
      },
    },
  });

  // autoplay controls
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!slider || !slider.current || shouldReduceMotion) return;

    let rafId: number;
    const container = slider.current.container;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!isPaused) {
        container.scrollLeft += scrollSpeed;
        const firstSlide = container.querySelector(
          ".keen-slider__slide"
        ) as HTMLElement;
        if (firstSlide) {
          const slideWidth =
            firstSlide.offsetWidth +
            parseFloat(getComputedStyle(firstSlide).marginRight || "0");
          if (
            container.scrollLeft >=
            container.scrollWidth - container.clientWidth - 1
          ) {
            container.scrollLeft = slideWidth;
          }
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(rafId);
  }, [slider, isPaused, shouldReduceMotion]);

  return (
    <section className="relative py-10 sm:py-14 lg:py-20 bg-white overflow-hidden">
      {/* Heading container */}
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={cn(
            "flex flex-col-reverse justify-between sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8",
            isRTL ? "sm:flex-row-reverse sm:text-right" : "sm:text-left"
          )}
        >
          <Button
            size="lg"
            onClick={handleViewAll}
            className={cn(
              "self-start sm:self-auto",
              isRTL ? "sm:ml-6" : "sm:mr-6"
            )}
            aria-label={t("explore.viewAll")}
          >
            {t("explore.viewAll")}
          </Button>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900">
              {t("explore.title")}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {t("explore.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Full-width marquee row */}
      <div className="relative w-full">
        <div className="overflow-hidden py-2">
          <div
            ref={sliderRef}
            className="keen-slider px-4 flex"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {carouselItems.map((course, index) => (
              <div key={`${course.id}-${index}`} className="keen-slider__slide">
                <CourseCard course={course} byLabel={byLabel} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreMarquee;
