import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

export type Locale = 'en' | 'ar'

interface Translations {
  [key: string]: any
}

const translations: Record<Locale, Translations> = {
  en,
  ar
}

let currentLocale: Locale = 'ar'

export function setLocale(locale: Locale) {
  currentLocale = locale
}

export function getLocale(): Locale {
  return currentLocale
}

export function t(key: string): any {
  const keys = key.split('.')
  let value: any = translations[currentLocale]
  let foundInCurrentLocale = true
  
  // Try to find the key in current locale
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      foundInCurrentLocale = false
      break
    }
  }
  
  // If not found in current locale, try English fallback
  if (!foundInCurrentLocale && currentLocale !== 'en') {
    console.warn(`Translation key "${key}" not found in ${currentLocale} locale, falling back to English`)
    value = translations.en
    for (const fallbackKey of keys) {
      if (value && typeof value === 'object' && fallbackKey in value) {
        value = value[fallbackKey]
      } else {
        console.warn(`Translation key "${key}" not found in English fallback either`)
        return key // Return the key if not found anywhere
      }
    }
  } else if (!foundInCurrentLocale) {
    console.warn(`Translation key "${key}" not found in any locale`)
    return key
  }
  
  return value !== undefined ? value : key
}
