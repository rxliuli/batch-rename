import i18next from 'i18next'
import { TranslateType } from '../i18n'
import enUS from '../i18n/en-US.json'
import zhCN from '../i18n/zh-CN.json'
import { Lang } from './langs'
import { html as KeyboardEnUS } from '../i18n/keyboard.md'
import { html as KeyboardZhCN } from '../i18n/keyboard.zh-cn.md'

export function getLanguage(): Lang {
  // return 'en-US'
  return (localStorage.getItem('batchReanemLanguage') ?? navigator.language) as Lang
}

export function setLanguage(lang: Lang) {
  localStorage.setItem('batchReanemLanguage', lang)
  location.reload()
}

export const langs: { lang: Lang; label: string }[] = [
  { lang: 'en-US', label: 'English' },
  { lang: 'zh-CN', label: '简体中文' },
]

await i18next.init({
  lng: getLanguage(),
  fallbackLng: 'en-US',
  debug: true,
  resources: {
    'en-US': {
      translation: {
        ...enUS,
        'home.keyboard.desc': KeyboardEnUS,
      },
    },
    'zh-CN': {
      translation: {
        ...zhCN,
        'home.keyboard.desc': KeyboardZhCN,
      },
    },
  } as Record<Lang, { translation: any }>,
  keySeparator: false,
})

type T = TranslateType & {
  'home.keyboard.desc': {
    value: 'Keyboard'
    params: [key: 'home.keyboard.desc']
  }
}

/**
 * Get the translated text according to the key
 * @param args
 */
export function t<K extends keyof T>(...args: T[K]['params']): T[K]['value'] {
  // @ts-ignore
  return i18next.t(args[0], args[1])
}
