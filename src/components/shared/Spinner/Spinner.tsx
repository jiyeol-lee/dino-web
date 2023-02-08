import classNames from 'classnames'
import type { FC } from 'react'

interface SpinnerProps {
  className?: string
}

export const Spinner: FC<SpinnerProps> = ({ className }) => {
  return (
    <div
      className={classNames(
        'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]',
        className
      )}
      role="status"
    ></div>
  )
}
