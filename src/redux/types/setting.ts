import { Locales } from '@/constants/app'

export interface State {
  locale: Locales
}

export enum ActionType {
  SET_LOCALE = 'setting/setLocale'
}

export interface setLocaleAction {
  type: ActionType.SET_LOCALE
  value: Locales
}

export type Action = setLocaleAction
