import { Locales } from '@/constants/app'
import { ActionType } from '@/redux-types/setting'
import type { Action, State } from '@/redux-types/setting'

const initialState: State = {
  locale: Locales.EN
}

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_LOCALE: {
      return {
        ...state,
        locale: action.value
      }
    }

    default: {
      return state
    }
  }
}

export default reducer
