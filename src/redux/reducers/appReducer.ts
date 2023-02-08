import { ActionType } from '@/redux-types/app'
import type { Action, State } from '@/redux-types/app'
import { generateUuid } from '@/utils/app'

const initialState: State = {
  isLoading: false,
  toastMessages: []
}

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_LOADING: {
      return {
        ...state,
        isLoading: action.status
      }
    }

    case ActionType.ENQUEUE_ALERT: {
      return {
        ...state,
        toastMessages: state.toastMessages.concat({
          id: generateUuid(),
          severity: action.severity,
          message: action.message
        })
      }
    }

    case ActionType.DELETE_ALERT: {
      return {
        ...state,
        toastMessages: state.toastMessages.filter(
          (toastMessage) => toastMessage.id !== action.id
        )
      }
    }

    default: {
      return state
    }
  }
}

export default reducer
