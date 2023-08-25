import { useRef, useState } from 'react'
import { store } from './store'
import { DiffEditor, loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEvent } from 'react-use'
import isElectron from 'is-electron'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { PreviewModal } from './components/PreviewModal'
import { t } from './constants/i18n'
import { useDark } from './utils/useDark'

loader.config({ monaco })

export const EditView = () => {
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
      alert(t('edit.error.count'))
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
      alert(t('edit.success.web'))
      return
    }
    // electron 则直接写入文件
    await Promise.all([store.files.map((it, i) => window.api.rename((it as any).path, newFileNames[i]))])
    store.reset()
    // alert(t('edit.success.electron'))
  }
  const { isDark } = useDark()
  return (
    <div className="flex h-screen flex-col">
      <nav className="flex items-center justify-between bg-gray-200 px-4 py-2 dark:bg-gray-800">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white dark:bg-blue-300 dark:text-black"
          onClick={() => store.reset()}
        >
          {t('edit.cancel')}
        </button>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white dark:bg-blue-300 dark:text-black"
          onClick={() => setOpenModal(true)}
        >
          {t('edit.rename')}
        </button>
      </nav>
      <section ref={boxRef} className="flex-grow">
        <DiffEditor
          theme={isDark ? 'vs-dark' : 'vs-light'}
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
