import { HTMLAttributes } from 'preact/compat'
import clsx from 'clsx'

export function Button(
  props: HTMLAttributes<HTMLButtonElement> & {
    type?: 'primary'
  },
) {
  return (
    <button
      {...props}
      class={clsx(
        'rounded px-4 py-1 text-black',
        props.type !== 'primary' && 'dark:bg-gray-700 dark:text-white',
        props.type === 'primary' &&
          'bg-blue-500 dark:bg-blue-500 text-white dark:text-white',
        props.class,
      )}
    >
      {props.children}
    </button>
  )
}
