import { useRef, useState } from 'react'
import css from './EditFileName.module.css'
import { store } from './store'
import { DiffEditor, loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEvent } from 'react-use'
import isElectron from 'is-electron'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { PreviewModal } from './components/PreviewModal'

loader.config({ monaco })

export const EditFileName = () => {
  const boxRef = useRef<HTMLElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor>()
  const [openModal, setOpenModal] = useState(false)
  useEvent('resize', () => {
    if (!editorRef.current || !boxRef.current) {
      return
    }
    const rect = boxRef.current.getBoundingClientRect()
    editorRef.current.layout({
      width: rect.width,
      height: rect.height,
    })
  })

  async function onSave() {
    console.log('onSave', store.files, store.newFileName)
    const newFileNames = store.newFileName.trim().split('\n')
    if (store.files.length !== newFileNames.length) {
      alert('文件名数量不一致')
      return
    }
    // 不是 electron 则压缩为 zip 下载
    if (!isElectron()) {
      const zip = new JSZip()
      store.files.forEach((it, i) => {
        zip.file(newFileNames[i], it)
      })
      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, 'files.zip')
      store.reset()
      alert('重命名完成，文件已下载')
      return
    }
    // electron 则直接写入文件
    console.log('electron')
    await Promise.all([store.files.map((it, i) => window.api.rename((it as any).path, newFileNames[i]))])
    store.reset()
    alert('重命名完成')
  }

  return (
    <div className={css.edit}>
      <header>
        <nav className={css.nav}>
          <button onClick={() => store.reset()}>取消</button>
          <button onClick={() => setOpenModal(true)}>重命名</button>
          <span style={{ marginLeft: 'auto' }}></span>
        </nav>
      </header>
      <section ref={boxRef} className={css.editor}>
        <DiffEditor
          theme={'vs-dark'}
          height={'100%'}
          original={store.files.map((it) => it.name).join('\n')}
          modified={store.newFileName}
          onMount={(editor) => {
            editorRef.current = editor
            editor.getModifiedEditor().onDidChangeModelContent(() => {
              store.newFileName = editor.getModel()!.modified.getValue()
            })
            Reflect.set(globalThis, 'editor', editor)
          }}
        />
      </section>
      <PreviewModal open={openModal} close={() => setOpenModal(false)} onSave={onSave}>
        <div>
          {store.newFileName.split('\n').map((fileName) => (
            <div>{fileName}</div>
          ))}
        </div>
      </PreviewModal>
    </div>
  )
}
