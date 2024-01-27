import { TranslateType } from '../i18n'
import enUS from '../i18n/en-US.json'
import zhCN from '../i18n/zh-CN.json'
import { Lang } from './langs'

export function getLanguage(): Lang {
  if (typeof localStorage === 'undefined') {
    return 'en-US'
  }
  return (localStorage.getItem('batchReanemLanguage') ??
    navigator.language) as Lang
}

export function setLanguage(lang: Lang) {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem('batchReanemLanguage', lang)
  location.reload()
}

export const langs: { lang: Lang; label: string }[] = [
  { lang: 'en-US', label: 'English' },
  { lang: 'zh-CN', label: '简体中文' },
]

type T = TranslateType

/**
 * Get the translated text according to the key
 * @param args
 */
export function t<K extends keyof T>(...args: T[K]['params']): T[K]['value'] {
  return (getLanguage() === 'zh-CN' ? zhCN : enUS)[args[0]] as any
}
