import classNames from 'classnames'
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'

import { Spinner } from '@/components/shared/Spinner/Spinner'
import type { Color } from '@/types'

interface ButtonProps {
  className?: string
  loading?: boolean
  icon?: ReactNode
  // default to left
  iconPosition?: 'left' | 'right'
  // default to filled
  variant?: 'filled' | 'outlined'
  color?: Color
  label?: string
}

export const Button: FC<
  ButtonProps & Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonProps>
> = ({
  className,
  loading,
  icon,
  iconPosition,
  variant,
  color,
  label,
  ...props
}) => {
  return (
    <button
      className={classNames(
        '__button',
        {
          '__button-primary': color === 'primary',
          '__button-secondary': color === 'secondary',
          '__button-success': color === 'success',
          '__button-danger': color === 'danger',
          '__button-warning': color === 'warning',
          '__button-info': color === 'info',
          '__button-default': color === 'default',
          '__button-filled': variant === 'filled',
          '__button-outlined': variant === 'outlined',
          'rounded-full !p-2.5': !label
        },
        className
      )}
      {...props}
    >
      {!!loading && <Spinner className="w-4 h-4" />}

      {!!icon && (iconPosition === undefined || iconPosition === 'left') && (
        <span>{icon}</span>
      )}

      {!!label && <span>{label}</span>}

      {!!icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  )
}
