import { computed, signal } from '@preact/signals'
import path from 'pathe'

export const context = signal([] as File[] | string[])
export const originName = computed(() =>
  context.value
    .map((it) => path.basename(typeof it === 'string' ? it : it.name))
    .join('\n'),
)
