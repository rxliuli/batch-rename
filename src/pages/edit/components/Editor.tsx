import { useRef } from 'preact/compat'
import { context, originName } from '../../../store'
import { DiffEditor, loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEvent, useMount } from 'react-use'
import { useLocation } from 'preact-iso'
import { Signal } from '@preact/signals'

loader.config({ monaco })

export function Editor(props: { newFileName: Signal<string> }) {
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

export default Editor
