import en from '@/locales/en.json'

type Locale = 'en' | 'ar'

interface Translations {
  [key: string]: string | Translations
}

const translations: Record<Locale, Translations> = {
  en,
  ar: {} // Will be added later for Arabic support
}

let currentLocale: Locale = 'en'

export function setLocale(locale: Locale) {
  currentLocale = locale
}

export function getLocale(): Locale {
  return currentLocale
}

export function t(key: string): string {
  const keys = key.split('.')
  let value: any = translations[currentLocale]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // Fallback to English if key not found
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key // Return the key if not found anywhere
        }
      }
    }
  }
  
  return typeof value === 'string' ? value : key
}
