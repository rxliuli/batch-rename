import { t } from '../constants/i18n'

interface Props {
  open: boolean
  close: () => void
  onSave: () => void
  children: React.ReactNode
}

export const PreviewModal = ({ open, close, onSave, children }: Props) => {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="min-h-1/4 h-auto max-w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 md:max-w-6xl">
        <div className="px-6 py-4 text-xl font-bold text-black dark:text-white">{t('preview.title')}</div>
        <div className="max-h-96 overflow-auto px-6 py-4 text-black dark:text-white">{children}</div>
        <div className="flex justify-end space-x-4 px-6 py-4">
          <button className="rounded bg-gray-300 px-4 py-2 text-black dark:bg-gray-700 dark:text-white" onClick={close}>
            {t('preview.cancel')}
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white dark:bg-blue-300 dark:text-black"
            onClick={onSave}
          >
            {t('preview.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
