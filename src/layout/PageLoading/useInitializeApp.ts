import { useRouter } from 'next/router'
import nookies from 'nookies'
import { useEffect, useState } from 'react'

import { Locales } from '@/constants/app'
import { Cookies } from '@/constants/cookies'
import { useCurrentUser } from '@/hooks/useHttpApp'
import { useAppDispatch } from '@/hooks/useRedux'
import { setLocale } from '@/redux-actions'

export const useInitializeApp = () => {
  const { isLoading: isUserLoading } = useCurrentUser()
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined

    const savedLocale = nookies.get()[Cookies.locale]
    dispatch(
      setLocale(
        Object.values(Locales).includes(savedLocale as Locales)
          ? (savedLocale as Locales)
          : Locales.EN
      )
    )

    if (!isUserLoading && router.isReady) {
      timer = setTimeout(() => {
        setIsInitialized(true)
      }, 250)
    }

    return () => {
      clearTimeout(timer)
      timer = undefined
    }
  }, [dispatch, isUserLoading, router.isReady])

  return { isInitialized }
}
