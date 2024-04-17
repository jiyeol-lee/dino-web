import axios from 'axios'
import type { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation, useTranslation } from 'next-i18next'
import App from 'next/app'
import type { AppContext, AppProps } from 'next/app'
import type { FC, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { createElement } from 'react'
import { Provider as ReduxProvider, useDispatch } from 'react-redux'
import { SWRConfig } from 'swr'
import type { SWRConfiguration } from 'swr'
import type { ProviderConfiguration } from 'swr/dist/types'

import { AlertColor } from '@/constants/app'
import { enqueueAlert } from '@/redux-actions'
import { store } from '@/redux-store'
import { createEmotionCache } from '@/utils/mui'
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/react'

import '../styles/globals.scss'

interface AppPropsWithLayout extends AppProps {
  emotionCache?: EmotionCache
  Component: NextPageWithLayout
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type Config = SWRConfiguration & Partial<ProviderConfiguration>

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export const SWRProvider: FC<PropsWithChildren<{ value?: Config }>> = (
  props
) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const configValue: Config = {
    fetcher: (resource, init) => axios(resource, init).then((res) => res.data),
    onError: () => {
      dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))
    },
    revalidateOnFocus: false,
    dedupingInterval: 0
  }
  return createElement(SWRConfig, { ...props, ...{ value: configValue } })
}

const MyApp = ({
  Component,
  emotionCache = clientSideEmotionCache,
  ...props
}: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ReduxProvider store={store}>
      <SWRProvider>
        <CacheProvider value={emotionCache}>
          <SessionProvider session={props.pageProps.session}>
            {getLayout(<Component {...props.pageProps} />)}
          </SessionProvider>
        </CacheProvider>
      </SWRProvider>
    </ReduxProvider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)

  return { appProps, pageProps: { ...appProps } }
}

export default appWithTranslation(MyApp)
