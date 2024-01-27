import { context } from '../../store'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'
import { getLanguage, setLanguage, t } from '../../constants/i18n'
import GitHubIcon from './assets/github.svg?react'
import { ReactComponent as KeyboardEnUS } from '../../i18n/keyboard.md'
import { ReactComponent as KeyboardZhCN } from '../../i18n/keyboard.zh-cn.md'
import { lazy, useLocation } from 'preact-iso'
import { isTauri } from '../../utils/isTauri'
import { h } from 'preact'
import { useSignal } from '@preact/signals'

function Header() {
  return (
    <nav className="flex items-center justify-between space-x-4 border-gray-200 py-4">
      <span className="flex-grow text-lg font-bold">{t('home.title')}</span>
      <select
        class={
          'h-10 rounded px-2 bg-white text-black dark:bg-black dark:text-white outline-none'
        }
        value={getLanguage()}
        onChange={(ev) => {
          setLanguage((ev.target as any).value as any)
        }}
        style={{ WebkitAppearance: 'none' }} // 隐藏 safari 的默认样式
      >
        <option value="en-US">English</option>
        <option value="zh-CN">简体中文</option>
      </select>
      <a
        href="https://github.com/rxliuli/batch-rename"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon className="h-8 w-8 cursor-pointer text-blue-500 hover:underline" />
      </a>
    </nav>
  )
}

function DragArea() {
  const draggable = useSignal(false)
  function onDragStart() {
    console.log('onDragStart')
    draggable.value = true
  }
  function onDragEnd() {
    console.log('onDragEnd')
    draggable.value = false
  }
  const loc = useLocation()
  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: (files) => {
      console.log('onDrop', files)
      context.value = files
      loc.route('/edit')
    },
    onFileDialogOpen: onDragStart,
    onFileDialogCancel: onDragEnd,
    onDragEnter: onDragStart,
    onDragLeave: onDragEnd,
    onDragOver: (ev: DragEvent) => {
      ev.preventDefault()
    },
  })
  return (
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
  )
}

function Footer() {
  return (
    <>
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
        <div className="prose mx-auto dark:prose-dark">
          {getLanguage() === 'zh-CN' ? <KeyboardZhCN /> : <KeyboardEnUS />}
        </div>
      </section>
    </>
  )
}

export function HomeView() {
  return (
    <div className={'container mx-auto px-4'}>
      <Header />
      {isTauri() ? (
        h(
          lazy(() => import('./components/DragAreaTauri')),
          null,
        )
      ) : (
        <DragArea />
      )}

      <Footer />
    </div>
  )
}
