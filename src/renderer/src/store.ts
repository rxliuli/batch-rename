import { observable } from 'mobx'

export const store = observable({
  step: 0,
  files: [] as File[],
  newFileName: '',
  next(files: File[]) {
    this.files = files
    this.newFileName = files.map((file) => file.name).join('\n')
    this.step += 1
  },
  reset() {
    this.step = 0
  }
})
