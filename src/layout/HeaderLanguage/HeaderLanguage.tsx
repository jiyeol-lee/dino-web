import { useCallback, useRef, useState } from 'react'

import { Button } from '@/components/shared/Button/Button'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { LanguageIcon } from '@heroicons/react/24/outline'

export const HeaderLanguage = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isOpenLanguageMenu, setOpenLanguageMenu] = useState(false)

  const openLanguageMenu = () => {
    setOpenLanguageMenu(true)
  }

  const handleClickOutside = useCallback(() => {
    if (isOpenLanguageMenu) {
      setOpenLanguageMenu(false)
    }
  }, [isOpenLanguageMenu])

  useOnClickOutside(ref, handleClickOutside)

  return (
    <div ref={ref} className="relative">
      <Button
        className="!border-none"
        variant="outlined"
        color="default"
        icon={<LanguageIcon className="w-6 h-6" />}
        onClick={openLanguageMenu}
      />
    </div>
  )
}
