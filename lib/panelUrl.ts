export const getPanelUrl = () => {
  const panelUrl =
    process.env.NEXT_PUBLIC_BACKEND_PANEL_URL || process.env.BACKEND_PANEL_URL

  if (!panelUrl || panelUrl.trim() === "") {
    console.warn("BACKEND_PANEL_URL environment variable is not set")
    return "https://panel.vod.borj.dev"
  }

  try {
    const { href } = new URL(panelUrl)
    return href.replace(/\/$/, "")
  } catch {
    const cleanUrl = panelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    return `https://${cleanUrl}`
  }
}

