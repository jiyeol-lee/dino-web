import axios from 'axios'
import type { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation, useTranslation } from 'next-i18next'
import App from 'next/app'
import type { AppContext, AppProps } from 'next/app'
import type { FC, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { createElement } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { SWRConfig } from 'swr'
import type { SWRConfiguration } from 'swr'
import type { ProviderConfiguration } from 'swr/dist/types'

import { AlertColor } from '@/constants/app'
import { useAppDispatch } from '@/hooks/useRedux'
import { enqueueAlert } from '@/redux-actions'
import { store } from '@/redux-store'

import '../styles/globals.scss'

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type Config = SWRConfiguration & Partial<ProviderConfiguration>

export const SWRProvider: FC<PropsWithChildren<{ value?: Config }>> = (
  props
) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const configValue: Config = {
    fetcher: (resource, init) => axios(resource, init).then((res) => res.data),
    onError: () => {
      dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))
    },
    dedupingInterval: 0
  }
  return createElement(SWRConfig, { ...props, ...{ value: configValue } })
}

const MyApp = ({ Component, ...props }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ReduxProvider store={store}>
      <SWRProvider>
        <SessionProvider session={props.pageProps.session}>
          {getLayout(<Component {...props.pageProps} />)}
        </SessionProvider>
      </SWRProvider>
    </ReduxProvider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)

  return { appProps, pageProps: { ...appProps } }
}

export default appWithTranslation(MyApp)
