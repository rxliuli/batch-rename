export function selectFiles(props?: Partial<Pick<HTMLInputElement, 'multiple' | 'accept'>>): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    Object.entries(props ?? {}).forEach(([key, value]) => {
      ;(input as any)[key] = value
    })
    input.onchange = () => {
      resolve([...(input.files ?? [])])
    }
    input.click()
  })
}
