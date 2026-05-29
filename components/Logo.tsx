'use client'

import { useState } from 'react'

interface LogoProps {
  /**
   * 'light' = voor donkere achtergronden (marine header), gebruikt /logo-white.png
   * 'dark'  = voor lichte achtergronden (login, email), gebruikt /logo-color.png
   */
  variant?: 'light' | 'dark'
  className?: string
  /** Pixels hoog. */
  height?: number
}

export function Logo({ variant = 'dark', className = '', height = 36 }: LogoProps) {
  const [errored, setErrored] = useState(false)
  const src = variant === 'light' ? '/logo-white.png' : '/logo-color.png'

  if (errored) {
    // Fallback naar tekst-logo
    return (
      <div className={`font-montserrat font-bold ${className}`}>
        Easy <span className="text-eoo-blue">Office</span> Online
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Easy Office Online"
      style={{ height, width: 'auto' }}
      className={className}
      onError={() => setErrored(true)}
    />
  )
}
