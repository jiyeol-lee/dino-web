import classNames from 'classnames'
import { useCallback, useRef } from 'react'
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'

interface DrawerProps {
  children: ReactNode
  className?: string
  open: boolean
  // default to left
  anchor?: 'left' | 'right'
  onClickOutside?: (event: Event) => void
}

export const Drawer: FC<
  DrawerProps & Omit<ComponentPropsWithoutRef<'div'>, keyof DrawerProps>
> = ({ children, className, open, anchor, onClickOutside, ...props }) => {
  const ref = useRef<HTMLDivElement>(null)
  const handleClickOutside = useCallback(
    (event: Event) => {
      if (open && onClickOutside) {
        onClickOutside(event)
      }
    },
    [open, onClickOutside]
  )

  useOnClickOutside(ref, handleClickOutside)

  return (
    <div
      ref={ref}
      data-testid="drawer"
      className={classNames(
        'fixed top-0 z-50 h-screen overflow-y-auto transition-transform w-80 drop-shadow-lg bg-surface-1 dark:bg-dark-surface-1',
        {
          'left-0 -translate-x-full': anchor === 'left' || anchor === undefined,
          'right-0 translate-x-full': anchor === 'right',
          'transform-none': open
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
