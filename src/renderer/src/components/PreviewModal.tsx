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
        <div className={css.header}>重命名文件预览</div>
        <div className={css.previewBox}>{children}</div>
        <div className={css.buttonGroup}>
          <button onClick={close}>返回</button>
          <button onClick={onSave}>保存</button>
        </div>
      </div>
    </div>
  )
}
