import css from './DragFiles.module.css'
import { store } from './store'
import { useDropzone } from 'react-dropzone'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useLocalRef } from './utils/mobx'
import { getLanguage, setLanguage, t } from './constants/i18n'

export const DragFiles = observer(() => {
  const draggable = useLocalRef(false)
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
    <div className={'container'}>
      <header>
        <nav className={css.nav}>
          <span className={css.logo}>{t('home.title')}</span>
          <select
            value={language.value}
            onChange={(ev) => {
              // console.log('ev.target.value', ev.target.value)
              setLanguage(ev.target.value as any)
            }}
          >
            <option value="en-US">English</option>
            <option value="zh-CN">简体中文</option>
          </select>
          <a href={'https://github.com/rxliuli/batch-rename'} target={'_blank'}>
            GitHub
          </a>
        </nav>
      </header>
      <div className={css.drag}>
        <div
          {...getRootProps({
            className: classNames(css.dropzone, {
              [css.draggable]: draggable.value,
            }),
          })}
        >
          <input {...getInputProps()} />
          <p>{t('home.dragTitle')}</p>
        </div>
      </div>
      <section>
        <h4>{t('home.demo')}</h4>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/PL3mft8DEHg"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={true}
        ></iframe>
      </section>
    </div>
  )
})
