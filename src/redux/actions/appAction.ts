import { AlertColor } from '@/constants/app'
import type { AppThunk } from '@/redux-types'
import { ActionType } from '@/redux-types/app'
import type { Action } from '@/redux-types/app'

export const showGlobalLoading = (): AppThunk<Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.SET_LOADING, status: true })
  }
}

export const hideGlobalLoading = (): AppThunk<Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.SET_LOADING, status: false })
  }
}

export const enqueueAlert = (
  severity: AlertColor,
  message: string
): AppThunk<Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.ENQUEUE_ALERT, severity, message })
  }
}

export const deleteAlert = (id: string): AppThunk<Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.DELETE_ALERT, id })
  }
}
