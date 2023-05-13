import { t } from '../constants/i18n'
import css from './PreviewModal.module.css'

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
    <div className={css.modal}>
      <div className={css.modalBox}>
        <div className={css.header}>{t('preview.title')}</div>
        <div className={css.previewBox}>{children}</div>
        <div className={css.buttonGroup}>
          <button onClick={close}>{t('preview.cancel')}</button>
          <button onClick={onSave}>{t('preview.save')}</button>
        </div>
      </div>
    </div>
  )
}
