import { context } from '../../../store'
import clsx from 'clsx'
import { t } from '../../../constants/i18n'
import { useLocation } from 'preact-iso'
import { dialog, event } from '@tauri-apps/api'
import { useSignal } from '@preact/signals'
import { useMount, useUnmount } from 'react-use'

export function DragAreaTauri() {
  const isDrag = useSignal(false)
  const loc = useLocation()
  async function onSelectFiles() {
    isDrag.value = true
    try {
      const r = await dialog.open({
        multiple: true,
        title: t('home.dragTitle'),
      })
      if (r === null) {
        return
      }
      context.value = typeof r === 'string' ? [r] : r
      loc.route('/edit')
    } finally {
      isDrag.value = false
    }
  }
  const unlistens = useSignal<event.UnlistenFn[]>([])
  const isHover = useSignal(false)
  useMount(async () => {
    unlistens.value = await Promise.all([
      event.listen('tauri://file-drop', (event) => {
        console.log(
          'tauri://file-drop',
          event.payload,
          isHover.value,
          isDrag.value,
        )
        if (
          !isDrag.value ||
          // !isHover.value ||
          event.payload === null ||
          !Array.isArray(event.payload) ||
          event.payload.length === 0 ||
          !event.payload.every((it) => typeof it === 'string')
        ) {
          return
        }
        isDrag.value = false
        context.value = event.payload
        loc.route('/edit')
      }),
      event.listen('tauri://file-drop-cancelled', () => {
        // console.log('tauri://file-drop-cancelled', isHover.value, isDrag.value)
        isDrag.value = false
      }),
      event.listen('tauri://file-drop-hover', () => {
        // console.log('tauri://file-drop-hover', isHover.value, isDrag.value)
        isDrag.value = true
      }),
    ])
    return () => {
      console.log('remove')
    }
  })
  useUnmount(() => unlistens.value.map((it) => it()))
  // console.log('isDrag', isDrag.value, 'isHover', isHover.value)
  return (
    <div
      class={clsx(
        'text-center flex h-64 items-center justify-center rounded-lg border-2 border-dashed',
        // TODO 从文件管理器拖拽到窗口时时触发不了
        // isHover.value &&
        isDrag.value ? 'border-blue-500' : 'border-gray-400',
      )}
      onMouseEnter={() => (isHover.value = true)}
      onMouseMove={() => (isHover.value = true)}
      onMouseLeave={() => (isHover.value = false)}
      onClick={onSelectFiles}
    >
      <p className="text-gray-500">{t('home.dragTitle')}</p>
    </div>
  )
}

export default DragAreaTauri
