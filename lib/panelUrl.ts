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

function withLocaleQuery(url: string, locale?: string): string {
  if (locale === "ar") {
    return `${url}?lang=ar`
  }
  return url
}

export const getPanelUrl = (locale?: string) => {
  return withLocaleQuery(getPanelBaseUrl(), locale)
}

export const getPanelPaymentsUrl = (locale?: string) => {
  return withLocaleQuery(`${getPanelBaseUrl()}/payments`, locale)
}

