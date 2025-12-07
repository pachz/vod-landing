"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout";
import { useDirection } from "@/providers/DirectionProvider";
import type { CourseDetailRecord } from "@/lib/server/course";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

interface CourseDetailClientProps {
  course: CourseDetailRecord;
  backHref: string;
  panelUrl?: string;
}

type LessonViewModel = {
  id?: string;
  title: string;
  duration: string;
  isPreview: boolean;
};

type CoursePricingViewModel = {
  priceAmount?: number;
  priceCurrency?: string;
  priceInterval?: string;
  productName?: string;
  priceId?: string;
  productId?: string;
};

type CourseCoachViewModel = {
  name: string;
  title: string;
  bio: string;
  image: string;
  rating: number;
  lastUpdated?: string;
};

type CourseViewModel = {
  id: string;
  title: string;
  fullDescription: string;
  shortDescription: string;
  learningOutcomes: string[];
  metaData: {
    totalDuration: string;
    lessonsCount: number;
    viewsCount: string;
    lastUpdated: string;
  };
  curriculum: LessonViewModel[];
  pricing: CoursePricingViewModel;
  coach: CourseCoachViewModel;
};

type ArabicContent = {
  title: string;
  fullDescription: string;
  shortDescription: string;
  learningOutcomes: string[];
  metaData: {
    totalDuration: string;
    lessonsCount: number;
    viewsCount: string;
    lastUpdated: string;
  };
  curriculum: string[];
  coach: {
    name: string;
    title: string;
    bio: string;
    lastUpdated?: string;
  };
};

const MOCK_COURSE = createMockCourseDetails();
const ARABIC_STATIC = createArabicContent();

export default function CourseDetailClient({
  course,
  backHref,
  panelUrl: panelUrlProp,
}: CourseDetailClientProps) {
  const { locale } = useDirection();
  const isAr = locale === "ar";
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum">(
    "overview"
  );
  const [shareUrl, setShareUrl] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);

  const courseContent = useMemo(() => buildCourseViewModel(course), [course]);
  const arabicContent = useMemo(
    () => buildArabicOverrides(course, courseContent),
    [course, courseContent]
  );
  const shortDescriptionContent = isAr
    ? arabicContent.shortDescription
    : courseContent.shortDescription;
  const overviewContent = isAr
    ? arabicContent.fullDescription
    : courseContent.fullDescription;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const displayTitle = isAr ? arabicContent.title : courseContent.title;
  const coachDisplayName = isAr
    ? arabicContent.coach.name
    : courseContent.coach.name;
  const coachTitle = isAr
    ? arabicContent.coach.title
    : courseContent.coach.title;
  const coachBio = isAr ? arabicContent.coach.bio : courseContent.coach.bio;
  const coachLastUpdated = isAr
    ? arabicContent.coach.lastUpdated
    : courseContent.coach.lastUpdated;
  const durationLabel = courseContent.metaData.totalDuration;
  const lessonsCount = courseContent.metaData.lessonsCount;
  const pricingDisplay = useMemo(
    () => getPricingDisplay(courseContent.pricing, isAr ? "ar" : "en"),
    [courseContent.pricing, isAr]
  );
  const previewEmbedUrl = useMemo(
    () => buildVimeoEmbedUrl(course.trialVideoUrl),
    [course.trialVideoUrl]
  );
  const enrollUrl = useMemo(() => {
    // Try prop first, then NEXT_PUBLIC_ env var (for client-side), then fallback
    const panelUrl = panelUrlProp || process.env.NEXT_PUBLIC_BACKEND_PANEL_URL;
    let baseUrl: string;

    if (!panelUrl) {
      console.warn("BACKEND_PANEL_URL environment variable is not set");
      baseUrl = "https://panel.vod.borj.dev";
    } else {
      try {
        const url = new URL(panelUrl);
        baseUrl = `${url.protocol}//${url.host}`;
      } catch {
        // If BACKEND_PANEL_URL is just a hostname without protocol, add https://
        const cleanUrl = panelUrl
          .replace(/^https?:\/\//, "")
          .replace(/\/$/, "");
        baseUrl = `https://${cleanUrl}`;
      }
    }

    const url = `${baseUrl}/courses/preview/${courseContent.id}`;
    // Append ?lang=ar if Arabic
    return isAr ? `${url}?lang=ar` : url;
  }, [courseContent.id, panelUrlProp, isAr]);

  const getLessonPreviewUrl = useMemo(() => {
    // Try prop first, then NEXT_PUBLIC_ env var (for client-side), then fallback
    const panelUrl = panelUrlProp || process.env.NEXT_PUBLIC_BACKEND_PANEL_URL;
    let baseUrl: string;

    if (!panelUrl) {
      console.warn("BACKEND_PANEL_URL environment variable is not set");
      baseUrl = "https://panel.vod.borj.dev";
    } else {
      try {
        const url = new URL(panelUrl);
        baseUrl = `${url.protocol}//${url.host}`;
      } catch {
        // If BACKEND_PANEL_URL is just a hostname without protocol, add https://
        const cleanUrl = panelUrl
          .replace(/^https?:\/\//, "")
          .replace(/\/$/, "");
        baseUrl = `https://${cleanUrl}`;
      }
    }

    return (lessonId?: string) => {
      const langParam = isAr ? '?lang=ar' : ''
      if (!lessonId || lessonId.trim() === '') {
        const url = `${baseUrl}/courses/preview/${courseContent.id}`
        return isAr ? `${url}?lang=ar` : url
      }
      const encodedLessonId = encodeURIComponent(lessonId.trim())
      const url = `${baseUrl}/courses/preview/${courseContent.id}?lesson=${encodedLessonId}`
      return isAr ? `${url}&lang=ar` : url
    }
  }, [courseContent.id, panelUrlProp, isAr])

  const previewSection = (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-purple-100">
      {previewEmbedUrl ? (
        <iframe
          src={previewEmbedUrl}
          title={isAr ? "فيديو المعاينة" : "Course preview"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
          <div className="text-center px-6">
            <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-purple-700 font-medium">
              {isAr ? "معاينة الدورة" : "Course Preview"}
            </p>
            <p className="text-sm text-purple-600">
              {isAr
                ? "فيديو المعاينة غير متوفر حالياً"
                : "Preview video unavailable"}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-bg" dir={isAr ? "rtl" : "ltr"}>
      <section className="bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="mb-6">
            <Link
              href={backHref}
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <svg
                className={cnIcon(isAr, "w-5 h-5 mr-2", "w-5 h-5 ml-2")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isAr ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                />
              </svg>
              {isAr ? "العودة إلى الدورات" : "Back to Courses"}
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-900 leading-tight mb-4">
                  {displayTitle}
                </h1>
              </div>

              {/* Mobile: show preview right after title, before content */}
              <div className="lg:hidden">{previewSection}</div>

              {shortDescriptionContent && (
                <MarkdownContent
                  content={shortDescriptionContent}
                  isAr={isAr}
                  variant="hero"
                />
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-6 border-t border-b border-purple-100">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-900">
                    {isAr
                      ? arabicContent.metaData.totalDuration
                      : courseContent.metaData.totalDuration}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-600">
                    {isAr ? "المدة الإجمالية" : "Total Duration"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-900">
                    {courseContent.metaData.lessonsCount}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-600">
                    {isAr ? "الدروس" : "Lessons"}
                  </div>
                </div>
                <div className="text-center sm:col-span-1 col-span-2">
                  <div className="text-xl sm:text-2xl font-bold text-purple-900">
                    {isAr
                      ? arabicContent.metaData.viewsCount
                      : courseContent.metaData.viewsCount}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-600">
                    {isAr ? "المشاهدات" : "Views"}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-purple-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="mb-0">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-purple-900">
                        {pricingDisplay.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-purple-600">
                        {pricingDisplay.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-900">
                        {pricingDisplay.amountLabel}
                      </div>
                      <div className="text-xs sm:text-sm text-purple-600">
                        {pricingDisplay.intervalLabel}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => (window.location.href = enrollUrl)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 text-base sm:text-lg"
                  >
                    {pricingDisplay.buttonLabel}
                  </Button>
                  <div className="flex flex-col items-center mt-3 text-xs sm:text-sm text-purple-600">
                    <span style={{ color: "#665BFF" }}>
                      {isAr ? "دفع آمن" : "Secure payment"}
                    </span>
                    <Image
                      src="/images/stripe.png"
                      alt="Stripe"
                      width={150}
                      height={35}
                      className="mb-2"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowShareOptions((prev) => !prev)}
                  aria-expanded={showShareOptions}
                  aria-controls={`share-options-${courseContent.id}`}
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <svg
                    className={isAr ? "w-5 h-5 ml-2" : "w-5 h-5 mr-2"}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  {isAr ? "مشاركة الدورة" : "Share Course"}
                </Button>
                {showShareOptions && (
                  <div
                    id={`share-options-${courseContent.id}`}
                    className="mt-4 space-y-3"
                  >
                    {!shareUrl && (
                      <div className="text-sm text-purple-500 text-center">
                        {isAr
                          ? "جاري تحضير روابط المشاركة..."
                          : "Preparing share options..."}
                      </div>
                    )}
                    {shareUrl && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <FacebookShareButton url={shareUrl}>
                          <div className="flex items-center gap-3 border border-purple-100 rounded-lg p-2 hover:bg-purple-50 transition-colors">
                            <FacebookIcon size={36} round />
                            <span className="text-sm font-medium text-purple-800">
                              {isAr ? "فيسبوك" : "Facebook"}
                            </span>
                          </div>
                        </FacebookShareButton>
                        <TwitterShareButton url={shareUrl} title={displayTitle}>
                          <div className="flex items-center gap-3 border border-purple-100 rounded-lg p-2 hover:bg-purple-50 transition-colors">
                            <TwitterIcon size={36} round />
                            <span className="text-sm font-medium text-purple-800">
                              {isAr ? "تويتر" : "Twitter"}
                            </span>
                          </div>
                        </TwitterShareButton>
                        <LinkedinShareButton url={shareUrl}>
                          <div className="flex items-center gap-3 border border-purple-100 rounded-lg p-2 hover:bg-purple-50 transition-colors">
                            <LinkedinIcon size={36} round />
                            <span className="text-sm font-medium text-purple-800">
                              {isAr ? "لينكدإن" : "LinkedIn"}
                            </span>
                          </div>
                        </LinkedinShareButton>
                        <WhatsappShareButton url={shareUrl}>
                          <div className="flex items-center gap-3 border border-purple-100 rounded-lg p-2 hover:bg-purple-50 transition-colors">
                            <WhatsappIcon size={36} round />
                            <span className="text-sm font-medium text-purple-800">
                              {isAr ? "واتساب" : "WhatsApp"}
                            </span>
                          </div>
                        </WhatsappShareButton>
                        <TelegramShareButton
                          url={shareUrl}
                          title={displayTitle}
                        >
                          <div className="flex items-center gap-3 border border-purple-100 rounded-lg p-2 hover:bg-purple-50 transition-colors">
                            <TelegramIcon size={36} round />
                            <span className="text-sm font-medium text-purple-800">
                              {isAr ? "تيليجرام" : "Telegram"}
                            </span>
                          </div>
                        </TelegramShareButton>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Desktop: preview in right column */}
              <div className="hidden lg:block">{previewSection}</div>

              <div className="bg-white border border-purple-100 rounded-xl p-6">
                <div
                  className={
                    isAr
                      ? "flex items-center space-x-reverse space-x-4 mb-4"
                      : "flex items-center space-x-4 mb-4"
                  }
                >
                  <Image
                    src={courseContent.coach.image}
                    alt={courseContent.coach.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-purple-900">
                      {coachDisplayName}
                    </h4>
                    <p className="text-sm text-purple-600">{coachTitle}</p>
                    <div
                      className={
                        isAr
                          ? "flex items-center space-x-reverse space-x-2 mt-1"
                          : "flex items-center space-x-2 mt-1"
                      }
                    >
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-purple-600">
                        {courseContent.coach.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-purple-700">{coachBio}</p>
                {coachLastUpdated && (
                  <p className="text-xs text-purple-500 mt-3">
                    {isAr ? "آخر تحديث للمدربة:" : "Coach profile updated:"}{" "}
                    {coachLastUpdated}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex border-b border-purple-100">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-purple-600 hover:text-purple-800"
              }`}
            >
              {isAr ? "نظرة عامة" : "Overview"}
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "curriculum"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-purple-600 hover:text-purple-800"
              }`}
            >
              {isAr ? "المنهج" : "Curriculum"}
            </button>
          </div>

          <div className="py-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <MarkdownContent
                    content={overviewContent}
                    isAr={isAr}
                    variant="overview"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-purple-900 mb-4">
                    {isAr ? "تفاصيل الدورة" : "Course Details"}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: isAr ? "المدة" : "Duration",
                        value: isAr
                          ? arabicContent.metaData.totalDuration
                          : courseContent.metaData.totalDuration,
                      },
                      {
                        label: isAr ? "عدد الدروس" : "Lessons",
                        value: courseContent.metaData.lessonsCount.toString(),
                      },
                      {
                        label: isAr ? "المشاهدات" : "Views",
                        value: isAr
                          ? arabicContent.metaData.viewsCount
                          : courseContent.metaData.viewsCount,
                      },
                      {
                        label: isAr ? "آخر تحديث" : "Updated",
                        value: isAr
                          ? arabicContent.metaData.lastUpdated
                          : courseContent.metaData.lastUpdated,
                      },
                    ].map((item, index) => (
                      <div
                        key={`detail-${index}`}
                        className="flex justify-between border border-purple-100 rounded-lg px-4 py-3"
                      >
                        <span className="text-purple-600">{item.label}:</span>
                        <span className="text-purple-900 font-medium">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-purple-900">
                    {isAr ? "منهج الدورة" : "Course Curriculum"}
                  </h3>
                  <div className="text-sm text-purple-600">
                    {courseContent.curriculum.length}{" "}
                    {isAr ? "دروس" : "lessons"} • {durationLabel}
                  </div>
                </div>
                <div className="bg-white border border-purple-100 rounded-xl overflow-hidden shadow-sm">
                  {courseContent.curriculum.map((lesson, index) => (
                    <div
                      key={index}
                      className={`px-6 py-4 flex items-center justify-between transition-colors ${
                        index !== courseContent.curriculum.length - 1
                          ? "border-b border-purple-50"
                          : ""
                      } hover:bg-purple-25`}
                    >
                      <div
                        className={
                          isAr
                            ? "flex items-center space-x-reverse space-x-4"
                            : "flex items-center space-x-4"
                        }
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-purple-700">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div
                            className={
                              isAr
                                ? "flex items-center space-x-reverse space-x-3"
                                : "flex items-center space-x-3"
                            }
                          >
                            <h5 className="font-medium text-purple-900">
                              {isAr
                                ? arabicContent.curriculum[index] ??
                                  lesson.title
                                : lesson.title}
                            </h5>
                            {lesson.isPreview && (
                              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
                                {isAr ? "معاينة" : "Preview"}
                              </span>
                            )}
                          </div>
                          <div
                            className={
                              isAr
                                ? "flex items-center space-x-reverse space-x-2 mt-1"
                                : "flex items-center space-x-2 mt-1"
                            }
                          >
                            <svg
                              className="w-4 h-4 text-purple-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span className="text-sm text-purple-500">
                              {isAr ? "درس فيديو" : "Video lesson"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          isAr
                            ? "flex items-center space-x-reverse space-x-3"
                            : "flex items-center space-x-3"
                        }
                      >
                        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                          {lesson.duration}
                        </span>
                        {lesson.id && lesson.id.trim() !== "" ? (
                          <a
                            href={getLessonPreviewUrl(lesson.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors cursor-pointer"
                            aria-label={
                              isAr
                                ? `تشغيل ${
                                    arabicContent.curriculum[index] ??
                                    lesson.title ??
                                    `الدرس ${index + 1}`
                                  }`
                                : `Play ${
                                    lesson.title ?? `Lesson ${index + 1}`
                                  }`
                            }
                            data-lesson-id={lesson.id}
                          >
                            <svg
                              className="w-4 h-4 text-purple-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </a>
                        ) : (
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center opacity-50 cursor-not-allowed">
                            <svg
                              className="w-4 h-4 text-purple-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function buildCourseViewModel(course: CourseDetailRecord): CourseViewModel {
  const lessons =
    course.lessons && course.lessons.length > 0
      ? course.lessons.map((lesson, index) => ({
          id: lesson.id,
          title: lesson.titleEn || `Lesson ${index + 1}`,
          duration: formatLessonDurationLabel(lesson.durationMinutes),
          isPreview: false,
        }))
      : cloneLessons(MOCK_COURSE.curriculum);

  const lastUpdatedLabel = formatUpdatedAtLabel(course.updatedAt, "en") ?? "—";
  const viewsLabel = getViewsLabel("en");
  const pricing = buildPricingViewModel(course);

  const coachRecord = course.coach;
  const coachLastUpdated = coachRecord?.lastUpdatedAt
    ? formatUpdatedAtLabel(coachRecord.lastUpdatedAt, "en")
    : undefined;
  const coachImage =
    coachRecord?.profileImageUrl ||
    coachRecord?.profileThumbnailUrl ||
    MOCK_COURSE.coach.image;
  const coachRating =
    coachRecord && coachRecord.rating > 0
      ? coachRecord.rating
      : MOCK_COURSE.coach.rating;

  return {
    id: course.id || MOCK_COURSE.id,
    title: course.titleEn?.trim() || MOCK_COURSE.title,
    fullDescription:
      course.descriptionEn?.trim() || MOCK_COURSE.fullDescription,
    shortDescription:
      course.shortDescriptionEn?.trim() || MOCK_COURSE.shortDescription,
    learningOutcomes: [...MOCK_COURSE.learningOutcomes],
    metaData: {
      totalDuration:
        course.durationMinutes && course.durationMinutes > 0
          ? formatTotalDuration(course.durationMinutes, "en")
          : MOCK_COURSE.metaData.totalDuration,
      lessonsCount: lessons.length,
      viewsCount: viewsLabel,
      lastUpdated: lastUpdatedLabel,
    },
    curriculum: lessons,
    pricing,
    coach: {
      name: coachRecord?.nameEn?.trim() || MOCK_COURSE.coach.name,
      title: coachRecord?.expertiseEn?.trim() || MOCK_COURSE.coach.title,
      bio: coachRecord?.descriptionEn?.trim() || MOCK_COURSE.coach.bio,
      image: coachImage,
      rating: coachRating,
      lastUpdated: coachLastUpdated || MOCK_COURSE.coach.lastUpdated,
    },
  };
}

function buildArabicOverrides(
  course: CourseDetailRecord,
  english: CourseViewModel
): ArabicContent {
  const lessonNames =
    course.lessons && course.lessons.length > 0
      ? course.lessons.map(
          (lesson, index) =>
            lesson.titleAr?.trim() ||
            lesson.titleEn?.trim() ||
            `الدرس ${index + 1}`
        )
      : [...ARABIC_STATIC.curriculum];

  const lastUpdatedLabel = formatUpdatedAtLabel(course.updatedAt, "ar") ?? "—";
  const viewsLabel = getViewsLabel("ar");

  const coachRecord = course.coach;
  const coachLastUpdated = coachRecord?.lastUpdatedAt
    ? formatUpdatedAtLabel(coachRecord.lastUpdatedAt, "ar")
    : english.coach.lastUpdated;

  return {
    title: course.titleAr?.trim() || ARABIC_STATIC.title,
    fullDescription:
      course.descriptionAr?.trim() || ARABIC_STATIC.fullDescription,
    shortDescription:
      course.shortDescriptionAr?.trim() ||
      course.shortDescriptionEn?.trim() ||
      ARABIC_STATIC.shortDescription,
    learningOutcomes: [...ARABIC_STATIC.learningOutcomes],
    metaData: {
      totalDuration:
        course.durationMinutes && course.durationMinutes > 0
          ? formatTotalDuration(course.durationMinutes, "ar")
          : ARABIC_STATIC.metaData.totalDuration,
      lessonsCount: english.metaData.lessonsCount,
      viewsCount: viewsLabel,
      lastUpdated: lastUpdatedLabel,
    },
    curriculum: lessonNames,
    coach: {
      name: coachRecord?.nameAr?.trim() || english.coach.name,
      title: coachRecord?.expertiseAr?.trim() || english.coach.title,
      bio: coachRecord?.descriptionAr?.trim() || english.coach.bio,
      lastUpdated: coachLastUpdated,
    },
  };
}

function buildPricingViewModel(
  course: CourseDetailRecord
): CoursePricingViewModel {
  if (!course.pricing) {
    return { ...MOCK_COURSE.pricing };
  }

  return {
    priceAmount: course.pricing.priceAmount ?? MOCK_COURSE.pricing.priceAmount,
    priceCurrency:
      course.pricing.priceCurrency ?? MOCK_COURSE.pricing.priceCurrency,
    priceInterval:
      course.pricing.priceInterval ?? MOCK_COURSE.pricing.priceInterval,
    productName: course.pricing.productName ?? MOCK_COURSE.pricing.productName,
    priceId: course.pricing.selectedPriceId ?? MOCK_COURSE.pricing.priceId,
    productId:
      course.pricing.selectedProductId ?? MOCK_COURSE.pricing.productId,
  };
}

function buildVimeoEmbedUrl(url?: string | null): string | undefined {
  if (!url) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) {
      return undefined;
    }

    const pathSegments = parsed.pathname.split("/").filter(Boolean);
    const videoIdCandidate = [...pathSegments]
      .reverse()
      .find((segment) => /^\d+$/.test(segment));

    if (!videoIdCandidate) {
      return undefined;
    }

    return `https://player.vimeo.com/video/${videoIdCandidate}?title=0&byline=0&portrait=0`;
  } catch {
    return undefined;
  }
}

function formatTotalDuration(minutes: number, locale: "en" | "ar"): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) {
    return locale === "ar"
      ? `${remainingMinutes} دقيقة`
      : `${remainingMinutes} minutes`;
  }

  if (locale === "ar") {
    return remainingMinutes > 0
      ? `${hours} ساعة ${remainingMinutes} دقيقة`
      : `${hours} ساعة`;
  }

  return remainingMinutes > 0
    ? `${hours} hours ${remainingMinutes} minutes`
    : `${hours} hours`;
}

function formatLessonDurationLabel(minutes?: number): string {
  if (!minutes || minutes <= 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function getViewsLabel(locale: "en" | "ar"): string {
  return locale === "ar" ? "أقل من ١٠٠" : "less than 100";
}

type PricingDisplay = {
  title: string;
  description: string;
  amountLabel: string;
  intervalLabel: string;
  buttonLabel: string;
};

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

function getPricingDisplay(
  pricing: CoursePricingViewModel,
  locale: "en" | "ar"
): PricingDisplay {
  const amountLabel =
    formatPricingAmount(pricing.priceAmount, pricing.priceCurrency, locale) ??
    (locale === "ar" ? "٨٫٥ د.ك" : "8.5 KWD");

  const isMonthly = pricing.priceInterval === "month";
  const isOneTime =
    !pricing.priceInterval || pricing.priceInterval === "one_time";

  const title = isMonthly
    ? locale === "ar"
      ? "اشتراك شهري"
      : "Monthly Subscription"
    : locale === "ar"
    ? "شراء لمرة واحدة"
    : "One-time Purchase";

  const description = isMonthly
    ? locale === "ar"
      ? "اشتركي شهرياً واحصلي على وصول كامل لهذه الدورة"
      : "Subscribe monthly and get full access to this course"
    : locale === "ar"
    ? "احصلي على وصول مدى الحياة لهذه الدورة"
    : "Get lifetime access to this course";

  const intervalLabel = isMonthly
    ? locale === "ar"
      ? "شهرياً"
      : "Per month"
    : locale === "ar"
    ? "دفعة واحدة"
    : "One-time payment";
  const buttonPrefix = locale === "ar" ? "اشتراك الآن" : "Enroll Now";
  const buttonLabel = buttonPrefix;

  return {
    title,
    description,
    amountLabel,
    intervalLabel,
    buttonLabel,
  };
}

function formatPricingAmount(
  amount?: number,
  currency?: string,
  locale: "en" | "ar" = "en"
): string | undefined {
  if (!amount || amount <= 0 || !currency) {
    return undefined;
  }

  const normalizedCurrency = currency.toUpperCase();
  const divisor = ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency) ? 1 : 100;
  const normalizedAmount = amount / divisor;

  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar" : "en", {
      style: "currency",
      currency: normalizedCurrency,
    }).format(normalizedAmount);
  } catch {
    return `${normalizedAmount.toFixed(2)} ${normalizedCurrency}`;
  }
}

function formatUpdatedAtLabel(
  updatedAt?: string,
  locale: "en" | "ar" = "en"
): string | undefined {
  if (!updatedAt) {
    return undefined;
  }

  const parsedDate = new Date(updatedAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  const formatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    year: "numeric",
    month: "long",
  });

  return formatter.format(parsedDate);
}

function cloneLessons(lessons: LessonViewModel[]): LessonViewModel[] {
  return lessons.map((lesson) => ({ ...lesson }));
}

function createMockCourseDetails(): CourseViewModel {
  return {
    id: "mock-course",
    title: "Building Confidence from Within",
    fullDescription:
      "This comprehensive course is designed to help you build unshakeable confidence from within. Through a series of practical exercises, real-world examples, and proven techniques, you'll learn to embrace your authentic self and develop the inner strength needed to pursue your dreams and goals.",
    shortDescription:
      "A practical program that helps you gain confidence with actionable lessons, exercises, and real-life tools.",
    learningOutcomes: [
      "Develop a deep understanding of your authentic self",
      "Build unshakeable confidence in any situation",
      "Overcome self-doubt and limiting beliefs",
      "Create a personal confidence action plan",
      "Learn to handle criticism and setbacks with grace",
      "Develop powerful self-talk and affirmation practices",
    ],
    metaData: {
      totalDuration: "2 hours 30 minutes",
      lessonsCount: 12,
      viewsCount: "less than 100",
      lastUpdated: "December 2024",
    },
    curriculum: [
      {
        title: "Welcome to Your Confidence Journey",
        duration: "8:45",
        isPreview: false,
      },
      {
        title: "Understanding Confidence vs. Arrogance",
        duration: "12:30",
        isPreview: false,
      },
      {
        title: "Your Personal Confidence Assessment",
        duration: "15:20",
        isPreview: false,
      },
      {
        title: "The Science of Self-Confidence",
        duration: "18:15",
        isPreview: false,
      },
      {
        title: "Identifying Your Strengths and Values",
        duration: "22:10",
        isPreview: false,
      },
      {
        title: "Overcoming Imposter Syndrome",
        duration: "16:45",
        isPreview: false,
      },
      {
        title: "Body Language and Presence",
        duration: "14:30",
        isPreview: false,
      },
      {
        title: "Voice and Communication Confidence",
        duration: "19:25",
        isPreview: false,
      },
      {
        title: "Setting and Achieving Personal Goals",
        duration: "21:15",
        isPreview: false,
      },
      {
        title: "Handling Criticism and Feedback",
        duration: "17:40",
        isPreview: false,
      },
      {
        title: "Building Confidence in Relationships",
        duration: "20:30",
        isPreview: false,
      },
      {
        title: "Creating Your Confidence Maintenance Plan",
        duration: "13:20",
        isPreview: false,
      },
    ],
    pricing: {
      priceAmount: 850,
      priceCurrency: "KWD",
      priceInterval: "one_time",
      productName: "One-time Purchase",
    },
    coach: {
      name: "Reham Diva",
      title: "Confidence & Life Coach",
      bio: "Reham is a certified life coach with over 8 years of experience helping women build unshakeable confidence. She has worked with thousands of clients to overcome self-doubt and achieve their personal and professional goals.",
      image: "/images/w1.png",
      rating: 4.9,
      lastUpdated: "December 2024",
    },
  };
}

function createArabicContent(): ArabicContent {
  return {
    title: "برنامج أنوثة الديفا",
    fullDescription:
      "هذه الدورة الشاملة مصممة لمساعدتك على بناء ثقة لا تتزعزع من الداخل. من خلال سلسلة من التمارين العملية والأمثلة الواقعية والتقنيات المجربة، ستتعلمين كيفية احتضان ذاتك الحقيقية وتطوير القوة الداخلية اللازمة لتحقيق أحلامك وأهدافك.",
    shortDescription:
      "برنامج عملي يمنحك خطوات واضحة وتمارين واقعية لتقوية الثقة بالنفس.",
    learningOutcomes: [
      "تطوير فهم عميق لذاتك الحقيقية",
      "بناء ثقة لا تتزعزع في أي موقف",
      "التغلب على الشك الذاتي والمعتقدات المحدودة",
      "إنشاء خطة عمل شخصية للثقة",
      "تعلم التعامل مع النقد والنكسات بكرامة",
      "تطوير ممارسات حديث الذات والتأكيدات القوية",
    ],
    metaData: {
      totalDuration: "ساعتان و 30 دقيقة",
      lessonsCount: 12,
      viewsCount: "أقل من ١٠٠",
      lastUpdated: "ديسمبر 2024",
    },
    curriculum: [
      "مرحباً بك في رحلة الثقة",
      "فهم الفرق بين الثقة والغرور",
      "تقييمك الشخصي للثقة",
      "علم الثقة بالنفس",
      "تحديد نقاط قوتك وقيمك",
      "التغلب على متلازمة المحتال",
      "لغة الجسد والحضور",
      "ثقة الصوت والتواصل",
      "وضع وتحقيق الأهداف الشخصية",
      "التعامل مع النقد والملاحظات",
      "بناء الثقة في العلاقات",
      "إنشاء خطة صيانة الثقة",
    ],
    coach: {
      name: "رهام دیفا",
      title: "مدربة ثقة بالنفس",
      bio: "رهام هي مدربة حياة معتمدة لديها أكثر من 8 سنوات من الخبرة في مساعدة النساء على بناء ثقة لا تتزعزع.",
      lastUpdated: "ديسمبر 2024",
    },
  };
}

function cnIcon(isAr: boolean, ltr: string, rtl: string) {
  return isAr ? rtl : ltr;
}

type MarkdownContentProps = {
  content?: string;
  isAr: boolean;
  variant: "hero" | "overview";
};

function MarkdownContent({ content, isAr, variant }: MarkdownContentProps) {
  if (!content || !content.trim()) {
    return null;
  }

  const headingClass = "text-xl font-semibold text-purple-900";
  const paragraphClass =
    variant === "hero"
      ? "text-base text-purple-700 leading-relaxed whitespace-pre-line"
      : "text-purple-700 leading-relaxed whitespace-pre-line";

  const containerClass =
    variant === "hero"
      ? "space-y-3 text-purple-700 leading-relaxed mb-6"
      : "space-y-3 text-purple-700 leading-relaxed";

  return (
    <div className={containerClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: ({ node, ...props }) => (
            <h3 className={headingClass} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h3 className={headingClass} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className={headingClass} {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className={headingClass} {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className={paragraphClass} {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="space-y-2" {...props} />,
          li: ({ node, children, ...props }) => (
            <li
              className={
                isAr
                  ? "flex items-start space-x-reverse space-x-3"
                  : "flex items-start space-x-3"
              }
              {...props}
            >
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-purple-700">{children}</span>
            </li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
