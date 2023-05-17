import { store } from './store'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'
import { observer, useLocalStore } from 'mobx-react-lite'
import { useLocalRef } from './utils/mobx'
import { getLanguage, setLanguage, t } from './constants/i18n'
import { useDark } from './utils/useDark'

const ToggleTheme = () => {
  const { isDark, toggle } = useDark()

  return (
    <button
      className="flex items-center justify-center rounded p-2 focus:outline-none focus:ring-0 active:bg-transparent dark:bg-transparent"
      onClick={toggle}
    >
      {!isDark ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="h-8 w-8"
        >
          <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" className="fill-sky-400/20 stroke-sky-500"></path>
          <path
            d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
            className="stroke-sky-500"
          ></path>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
            className="fill-sky-400/20"
          ></path>
          <path
            d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
            className="fill-sky-500"
          ></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
            className="fill-sky-500"
          ></path>
        </svg>
      )}
    </button>
  )
}

export const HomeView = observer(() => {
  const draggable = useLocalStore(() => ({
    value: false,
  }))
  function onDragStart() {
    console.log('onDragStart')
    draggable.value = true
  }
  function onDragEnd() {
    console.log('onDragEnd')
    draggable.value = false
  }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log('onDrop', acceptedFiles)
      store.next(acceptedFiles)
    },
    onFileDialogOpen: onDragStart,
    onFileDialogCancel: onDragEnd,
    onDragEnter: onDragStart,
    onDragLeave: onDragEnd,
    onDragOver: (ev) => {
      ev.preventDefault()
    },
  })
  const language = useLocalRef(getLanguage())
  return (
    <div className={'container mx-auto px-4'}>
      <nav className="flex items-center justify-between space-x-4 border-gray-200 py-4">
        <span className="flex-grow text-lg font-bold">{t('home.title')}</span>
        <select
          className="h-10 rounded bg-white px-2 text-black dark:bg-gray-800 dark:text-white"
          value={language.value}
          onChange={(ev) => {
            setLanguage(ev.target.value as any)
          }}
        >
          <option value="en-US">English</option>
          <option value="zh-CN">简体中文</option>
        </select>
        <ToggleTheme />
        <a href="https://github.com/rxliuli/batch-rename" target="_blank" rel="noopener noreferrer">
          <svg
            viewBox="0 0 16 16"
            className="h-8 w-8 cursor-pointer text-blue-500 hover:underline"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </a>
      </nav>
      <div
        {...getRootProps({
          className: clsx(
            'text-center flex h-64 items-center justify-center rounded-lg border-2 border-dashed',
            draggable.value ? 'border-blue-500' : 'border-gray-400',
          ),
          tabIndex: 0,
        })}
      >
        <input {...getInputProps()} tabIndex={-1} className="hidden" />
        <p className="text-gray-500">{t('home.dragTitle')}</p>
      </div>
      <section className="my-8">
        <h4 className="mb-4 text-xl font-bold">{t('home.demo')}</h4>
        <div className="mx-auto" style={{ maxWidth: '890px', height: '331px' }}>
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/PL3mft8DEHg"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={true}
          ></iframe>
        </div>
      </section>
      <section className="py-8">
        <h4 className="mb-4 text-xl font-bold">{t('home.keyboard')}</h4>
        <div
          className="prose mx-auto dark:prose-dark"
          dangerouslySetInnerHTML={{
            __html: t('home.keyboard.desc'),
          }}
        ></div>
      </section>
    </div>
  )
})
