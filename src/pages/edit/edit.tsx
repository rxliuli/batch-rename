import { useMemo, useRef } from 'preact/compat'
import { context, originName } from '../../store'
import { DiffEditor, loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEvent, useMount } from 'react-use'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { PreviewModal } from './components/PreviewModal'
import { t } from '../../constants/i18n'
import { fs } from '@tauri-apps/api'
import { useLocation } from 'preact-iso'
import { Signal, useSignal } from '@preact/signals'
import { isTauri } from '../../utils/isTauri'
import path from 'pathe'
import { Button } from './components/Button'

function Toolbar(props: { newFileName: Signal<string> }) {
  const isOpenModal = useSignal(false)
  const loc = useLocation()
  function back() {
    loc.route('/')
  }

  async function onSave() {
    console.log('onSave', context.value, props.newFileName)
    const newFileNames = props.newFileName.value.trim().split('\n')
    console.log('newFileNames', newFileNames)
    if (context.value.length !== newFileNames.length) {
      alert(t('edit.error.count'))
      return
    }
    // 不是 electron 则压缩为 zip 下载
    // TODO 需要判断是否在 tauri 中
    if (!isTauri()) {
      const zip = new JSZip()
      context.value.forEach((it, i) => {
        zip.file(newFileNames[i], it)
      })
      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, 'files.zip')
      back()
      alert(t('edit.success.web'))
      return
    }
    // electron 则直接写入文件
    await Promise.all([
      context.value.map((it, i) =>
        fs.renameFile(
          it as string,
          path.join(path.dirname(it as string), newFileNames[i]),
        ),
      ),
    ])
    back()
    // alert(t('edit.success.electron'))
  }

  return (
    <header>
      <nav className="flex items-center justify-between bg-gray-200 px-4 py-2 dark:bg-gray-800">
        <Button onClick={back}>{t('edit.cancel')}</Button>
        <Button type={'primary'} onClick={() => (isOpenModal.value = true)}>
          {t('edit.rename')}
        </Button>
      </nav>
      <PreviewModal
        isOpen={isOpenModal.value}
        onClose={() => (isOpenModal.value = false)}
        onSave={onSave}
      >
        <div>
          {props.newFileName.value.split('\n').map((it) => (
            <div>{it}</div>
          ))}
        </div>
      </PreviewModal>
    </header>
  )
}

loader.config({ monaco })

function Editor(props: { newFileName: Signal<string> }) {
  const loc = useLocation()
  function back() {
    loc.route('/')
  }

  useMount(() => {
    if (context.value.length === 0) {
      back()
    }
  })

  const boxRef = useRef<HTMLElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor>()

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
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return (
    <section ref={boxRef} className="flex-grow">
      <DiffEditor
        theme={isDark ? 'vs-dark' : 'vs-light'}
        height={'100%'}
        original={originName.value}
        modified={props.newFileName.value}
        options={{
          fontSize: 16, // Set the font size to 16
        }}
        onMount={(editor: monaco.editor.IStandaloneDiffEditor) => {
          editorRef.current = editor
          editor.getModifiedEditor().onDidChangeModelContent(() => {
            props.newFileName.value = editor.getModel()!.modified.getValue()
          })
          Reflect.set(globalThis, 'editor', editor)
        }}
      />
    </section>
  )
}

export const EditView = () => {
  const newFileName = useSignal(originName.value)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar newFileName={newFileName} />
      <Editor newFileName={newFileName} />
    </div>
  )
}

export default EditView
