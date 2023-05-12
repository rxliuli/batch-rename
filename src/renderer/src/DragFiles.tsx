import css from './DragFiles.module.css'
import { store } from './store'
import { useDropzone } from 'react-dropzone'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useLocalRef } from './utils/mobx'

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
    }
  })
  return (
    <div>
      <header>
        <nav className={css.nav}>
          <span className={css.logo}>文件批量重命名</span>
          <a href={'https://github.com/rxliuli/batch-rename'} target={'_blank'}>GitHub</a>
        </nav>
      </header>
      <div className={css.drag}>
        <div
          {...getRootProps({
            className: classNames(css.dropzone, {
              [css.draggable]: draggable.value
            })
          })}
        >
          <input {...getInputProps()} />
          <p>拖拽文件到这儿或点击选择一些文件</p>
        </div>
      </div>
    </div>
  )
})
