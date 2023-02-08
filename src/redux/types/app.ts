import { AlertColor } from '@/constants/app'
import type { ToastMessage } from '@/types'

export interface State {
  isLoading: boolean
  toastMessages: ToastMessage[]
}

export enum ActionType {
  SET_LOADING = 'app/setLoading',
  ENQUEUE_ALERT = 'app/enqueueAlert',
  DELETE_ALERT = 'app/deleteAlert'
}

export interface setLoadingAction {
  type: ActionType.SET_LOADING
  status: boolean
}

export interface enqueueAlertAction {
  type: ActionType.ENQUEUE_ALERT
  severity: AlertColor
  message: string
}

export interface deleteAlertAction {
  type: ActionType.DELETE_ALERT
  id: string
}

export type Action = setLoadingAction | enqueueAlertAction | deleteAlertAction
