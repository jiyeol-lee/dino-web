import type { RootState } from '@/redux-types'

export const selectLocale = (state: RootState) => state.setting.locale
