import { useState, useEffect } from 'react'

export function useDark() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // 检查 localStorage 和系统主题
    const darkModeOn = localStorage.getItem('dark')
      ? localStorage.getItem('dark') === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches

    setIsDark(darkModeOn)

    // 添加或删除 dark 类
    if (darkModeOn) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggle = () => {
    setIsDark(!isDark)

    // 更新 localStorage
    localStorage.setItem('dark', String(!isDark))

    // 添加或删除 dark 类
    if (!isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return { isDark, toggle }
}
