// import { ElectronAPI } from '@electron-toolkit/preload'

export interface ExportElectronApi {
  hello(name: string): Promise<string>
  /**
   * 更新文件名
   * @param originPath 源文件路径
   * @param newName 新的文件名
   */
  rename(originPath: string, newName: string): Promise<void>
}

declare global {
  interface Window {
    // electron: ElectronAPI
    api: ExportElectronApi
  }
}
