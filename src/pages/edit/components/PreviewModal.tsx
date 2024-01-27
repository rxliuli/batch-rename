import { JSX } from 'preact'
import { t } from '../../../constants/i18n'
import { Button } from './Button'

export function PreviewModal(props: {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  children: JSX.Element
}) {
  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      props.onClose()
    }
  }

  if (!props.isOpen) {
    return null
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white dark:bg-gray-800">
        <div className="px-6 py-4 text-xl font-bold text-black dark:text-white">
          {t('preview.title')}
        </div>
        <div className="max-h-72 overflow-auto px-6 py-4 text-black dark:text-white">
          {props.children}
        </div>
        <div className="flex justify-end space-x-4 px-6 py-4">
          <Button onClick={props.onClose}>{t('preview.cancel')}</Button>
          <Button type={'primary'} onClick={props.onSave}>
            {t('preview.save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
