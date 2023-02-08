import nookies from 'nookies'

import { COOKIES_OPTION, Locales } from '@/constants/app'
import { Cookies } from '@/constants/cookies'
import type { AppThunk } from '@/redux-types'
import { ActionType } from '@/redux-types/setting'
import type { Action } from '@/redux-types/setting'

export const setLocale = (locale: Locales): AppThunk<Action> => {
  return (dispatch) => {
    nookies.set(null, Cookies.locale, locale, COOKIES_OPTION)

    dispatch({ type: ActionType.SET_LOCALE, value: locale })
  }
}
