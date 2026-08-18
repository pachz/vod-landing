/**
 * Build a Vimeo player embed URL from a share/watch link.
 * Example: https://vimeo.com/1219201266 → https://player.vimeo.com/video/1219201266
 */
function getVimeoVideoId(url?: string | null): string | undefined {
  if (!url) return undefined

  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('vimeo.com')) {
      return undefined
    }

    const pathSegments = parsed.pathname.split('/').filter(Boolean)
    return [...pathSegments].reverse().find((segment) => /^\d+$/.test(segment))
  } catch {
    return undefined
  }
}

export function buildVimeoEmbedUrl(
  url?: string | null,
  options: { autoplay?: boolean } = {}
): string | undefined {
  const videoId = getVimeoVideoId(url)
  if (!videoId) return undefined

  const params = new URLSearchParams({
    title: '0',
    byline: '0',
    portrait: '0',
    dnt: '1',
  })

  if (options.autoplay) {
    params.set('autoplay', '1')
  }

  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`
}
