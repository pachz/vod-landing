export const getPanelUrl = (locale?: string) => {
  const panelUrl =
    process.env.NEXT_PUBLIC_BACKEND_PANEL_URL || process.env.BACKEND_PANEL_URL

  let baseUrl: string
  if (!panelUrl || panelUrl.trim() === "") {
    console.warn("BACKEND_PANEL_URL environment variable is not set")
    baseUrl = "https://panel.vod.borj.dev"
  } else {
    try {
      const { href } = new URL(panelUrl)
      baseUrl = href.replace(/\/$/, "")
    } catch {
      const cleanUrl = panelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
      baseUrl = `https://${cleanUrl}`
    }
  }

  // Append ?lang=ar if locale is Arabic
  if (locale === 'ar') {
    return `${baseUrl}?lang=ar`
  }

  return baseUrl
}

