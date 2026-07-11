function getPanelBaseUrl(): string {
  const panelUrl =
    process.env.NEXT_PUBLIC_BACKEND_PANEL_URL || process.env.BACKEND_PANEL_URL

  if (!panelUrl || panelUrl.trim() === "") {
    console.warn("BACKEND_PANEL_URL environment variable is not set")
    return "https://panel.vod.borj.dev"
  }

  try {
    const { protocol, host } = new URL(panelUrl)
    return `${protocol}//${host}`
  } catch {
    const cleanUrl = panelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    return `https://${cleanUrl}`
  }
}

function resolvePanelBaseUrl(override?: string): string {
  if (override?.trim()) {
    try {
      const { protocol, host } = new URL(override)
      return `${protocol}//${host}`
    } catch {
      const cleanUrl = override.replace(/^https?:\/\//, "").replace(/\/$/, "")
      return `https://${cleanUrl}`
    }
  }

  return getPanelBaseUrl()
}

function withLocaleQuery(url: string, locale?: string): string {
  if (locale !== "ar") {
    return url
  }

  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}lang=ar`
}

export const getPanelUrl = (locale?: string) => {
  return withLocaleQuery(getPanelBaseUrl(), locale)
}

export const getPanelPaymentsUrl = (locale?: string) => {
  return withLocaleQuery(`${getPanelBaseUrl()}/payments`, locale)
}

export const getPanelCoursePreviewUrl = (
  courseId: string,
  locale?: string,
  panelBaseUrl?: string
) => {
  const base = resolvePanelBaseUrl(panelBaseUrl)
  return withLocaleQuery(`${base}/courses/preview/${courseId}`, locale)
}

export const getPanelCourseLessonPreviewUrl = (
  courseId: string,
  lessonId: string,
  locale?: string,
  panelBaseUrl?: string
) => {
  const base = resolvePanelBaseUrl(panelBaseUrl)
  const encodedLessonId = encodeURIComponent(lessonId.trim())
  return withLocaleQuery(
    `${base}/courses/preview/${courseId}?lesson=${encodedLessonId}`,
    locale
  )
}

