import classNames from 'classnames'

import { Spinner } from '@/components/shared/Spinner/Spinner'
import { useAppSelector } from '@/hooks/useRedux'
import { selectGlobalLoadingState } from '@/redux-selectors'

import { useInitializeApp } from './useInitializeApp'

export const PageLoading = () => {
  const { isInitialized } = useInitializeApp()
  const isLoadingGlobally = useAppSelector(selectGlobalLoadingState)

  return (
    <div
      className={classNames('__backdrop z-global-loading', {
        hidden: !isLoadingGlobally && isInitialized,
        '__backdrop--opacity-50': isLoadingGlobally
      })}
    >
      <Spinner className="w-10 h-10" />
    </div>
  )
}
