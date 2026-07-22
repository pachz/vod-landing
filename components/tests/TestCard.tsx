"use client";

import { ClipboardList, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TestCardItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  questionCount: number;
};

export type TestCardProps = {
  test: TestCardItem;
  isRtl: boolean;
  startLabel: string;
  questionLabel: string;
  questionsLabel: string;
  onStart: (testId: string) => void;
};

export default function TestCard({
  test,
  isRtl,
  startLabel,
  questionLabel,
  questionsLabel,
  onStart,
}: TestCardProps) {
  const questionsText = `${test.questionCount} ${
    test.questionCount === 1 ? questionLabel : questionsLabel
  }`;

  return (
    <Card className="overflow-hidden border-gray-200 bg-white shadow-sm">
      <div
        dir="ltr"
        className={cn(
          "flex flex-col sm:flex-row",
          isRtl && "sm:flex-row-reverse"
        )}
      >
        <div className="relative h-40 w-full shrink-0 overflow-hidden bg-gray-100 sm:h-auto sm:w-44">
          {test.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={test.thumbnailUrl}
              alt={test.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full min-h-[10rem] w-full items-center justify-center bg-gradient-to-br from-pink-50 via-white to-gray-100 text-gray-400">
              <ClipboardList className="h-10 w-10 opacity-50" />
            </div>
          )}
        </div>

        <div
          className="flex min-w-0 flex-1 flex-col"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className={cn("space-y-2", isRtl ? "text-right" : "text-left")}>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {test.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300">
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
                <span>{questionsText}</span>
              </div>
            </div>
            <Button
              size="sm"
              className="shrink-0 rounded-full px-5"
              onClick={() => onStart(test.id)}
            >
              {startLabel}
            </Button>
          </CardHeader>

          {test.description ? (
            <CardContent className="pt-0">
              <p
                className={cn(
                  "line-clamp-3 text-sm text-gray-500",
                  isRtl ? "text-right" : "text-left"
                )}
              >
                {test.description}
              </p>
            </CardContent>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
