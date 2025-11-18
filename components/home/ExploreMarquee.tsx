"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { courses } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/useTranslation";
import { Video } from "@/components/course";
import { motion } from "framer-motion";

// Component props interface
export interface ExploreMarqueeProps {
  videos?: Video[];
  categories?: string[];
  initialCategory?: string;
  onCategoryChange?: (category: string) => void;
  onViewAllClick?: () => void;
  viewAllRoute?: string;
  marqueeSpeed?: number;
  reduceMotionFallback?: boolean;
  onCourseClick?: (videoId: string) => void;
}

interface CarouselApiItem {
  id: string;
  slug?: string;
  title: string;
  category: string;
  duration: string;
  image: string;
}

interface CarouselItem extends CarouselApiItem {
  description?: string;
  instructor: string;
}

interface CourseCardProps {
  course: CarouselItem;
  byLabel: string;
  className?: string;
  onClick?: (course: CarouselItem) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  byLabel,
  className,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        "relative w-[280px] sm:w-[360px] lg:w-[420px] h-[160px] sm:h-[190px] lg:h-[220px] overflow-hidden cursor-pointer transition-transform duration-300 ease-out group rounded-3xl",
        className
      )}
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(course)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.(course);
        }
      }}
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
          {/* <p className="text-[11px] sm:text-xs text-white/85 line-clamp-1">
            {byLabel} {course.instructor}
          </p> */}
        </div>
      </div>
    </Card>
  );
};

interface MarqueeRowProps {
  courses: CarouselItem[];
  byLabel: string;
  direction: "left" | "right";
  speed: number;
  reduceMotion: boolean;
  onCourseClick?: (course: CarouselItem) => void;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({
  courses,
  byLabel,
  direction,
  speed,
  reduceMotion,
  onCourseClick,
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || reduceMotion) return;

    const handleEnter = () => setIsPaused(true);
    const handleLeave = () => setIsPaused(false);

    row.addEventListener("mouseenter", handleEnter);
    row.addEventListener("mouseleave", handleLeave);
    row.addEventListener("touchstart", handleEnter, { passive: true });
    row.addEventListener("touchend", handleLeave, { passive: true });

    return () => {
      row.removeEventListener("mouseenter", handleEnter);
      row.removeEventListener("mouseleave", handleLeave);
      row.removeEventListener("touchstart", handleEnter);
      row.removeEventListener("touchend", handleLeave);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div
        className={cn(
          "flex gap-4 sm:gap-6 px-4 overflow-x-auto scrollbar-hide",
          direction === "right" ? "flex-row-reverse" : ""
        )}
      >
        {courses.map((course) => (
          <div
            key={course.id}
            className="w-[260px] sm:w-[300px] lg:w-[360px] flex-shrink-0 mx-4"
          >
            <CourseCard
              course={course}
              byLabel={byLabel}
              onClick={onCourseClick}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div
        ref={rowRef}
        className={cn(
          "flex gap-4 sm:gap-6 w-max px-4 will-change-transform",
          direction === "left"
            ? "animate-marquee-left"
            : "animate-marquee-right"
        )}
        style={{
          animationDuration: `${Math.max(10, speed)}s`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {[...courses, ...courses].map((course, index) => (
          <div
            key={`${course.id}-${index}`}
            className="w-[260px] sm:w-[300px] lg:w-[360px] flex-shrink-0 mx-6"
          >
            <CourseCard
              course={course}
              byLabel={byLabel}
              onClick={onCourseClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ExploreMarquee: React.FC<ExploreMarqueeProps> = ({
  marqueeSpeed = 30,
  reduceMotionFallback = false,
  viewAllRoute = "/videos",
  onViewAllClick,
  onCourseClick,
}) => {
  const { t, locale } = useTranslation();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [remoteCourses, setRemoteCourses] = useState<CarouselItem[]>([]);
  const [isFetchingRemote, setIsFetchingRemote] = useState(false);

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
    let isActive = true;
    const controller = new AbortController();

    async function loadCarouselData() {
      setIsFetchingRemote(true);
      try {
        const response = await fetch(`/api/carousel?locale=${locale}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const payload = (await response.json()) as {
          items?: CarouselApiItem[];
        };

        if (!isActive) return;

        const normalizedItems =
          payload.items?.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            instructor: "",
            duration: item.duration,
            category: item.category,
            image: item.image,
          })) ?? [];

        setRemoteCourses(normalizedItems);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("[ExploreMarquee] Unable to fetch carousel data", error);
        if (isActive) {
          setRemoteCourses([]);
        }
      } finally {
        if (isActive) {
          setIsFetchingRemote(false);
        }
      }
    }

    loadCarouselData();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [locale]);

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
    remoteCourses.length > 0
      ? remoteCourses
      : Array.isArray(translatedCarousel) && translatedCarousel.length > 0
      ? (translatedCarousel as CarouselItem[])
      : fallbackCourses;

  const shouldReduceMotion = prefersReducedMotion || reduceMotionFallback;
  const isRTL = locale === "ar";
  const marqueeSpeedValue = Math.max(15, marqueeSpeed);

  const handleViewAll = () => {
    if (onViewAllClick) {
      onViewAllClick();
      return;
    }
    if (typeof window !== "undefined") {
      window.location.href = viewAllRoute;
    }
  };

  const handleCourseSelect = (course: CarouselItem) => {
    const fallbackSlug = course.slug ?? course.id;
    if (onCourseClick) {
      onCourseClick(fallbackSlug);
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = `/${locale}/course/${fallbackSlug}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-12 sm:mb-16"
    >
      <section
        className="relative py-10 sm:py-14 lg:py-20 bg-white overflow-hidden"
        aria-busy={isFetchingRemote}
      >
        <div className="max-w-7xl mx-auto px-4 text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900">
            {t("explore.title")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 mb-6 sm:mb-8">
            {t("explore.subtitle")}
          </p>
        </div>

        {/* Full-width marquee row */}
        <div className="relative w-full">
          <MarqueeRow
            courses={carouselItems}
            byLabel={byLabel}
            direction={isRTL ? "right" : "left"}
            speed={marqueeSpeedValue}
            reduceMotion={shouldReduceMotion}
            onCourseClick={handleCourseSelect}
          />
          <div className="text-center mt-6 sm:mt-10">
            <Button
              size="lg"
              onClick={handleViewAll}
              className="mx-auto"
              aria-label={t("explore.viewAll")}
            >
              {t("explore.viewAll")}
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ExploreMarquee;
