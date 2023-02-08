import type { RootState } from '@/redux-types'

export const selectGlobalLoadingState = (state: RootState) =>
  state.app.isLoading

export const selectToastMessages = (state: RootState) => state.app.toastMessages
