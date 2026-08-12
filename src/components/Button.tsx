/** Button — famille « . » 03.1
 *  Textuel par défaut : la surface n'apparaît que pour l'action principale. */

import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'text' | 'quiet' | 'destructive'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant
  /** Souligne l'action destructive quand elle confirme. */
  strong?: boolean
  block?: boolean
  children: ReactNode
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn btn--primary',
  text: 'btn btn--text',
  quiet: 'btn btn--quiet',
  destructive: 'btn btn--destructive',
}

export function Button({
  variant = 'text',
  strong = false,
  block = false,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    VARIANT_CLASS[variant],
    strong && variant === 'destructive' ? 'btn--destructive-strong' : '',
    block ? 'btn--block' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
