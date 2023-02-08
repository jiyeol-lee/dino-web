import { store } from '@/redux-store'
import type { AnyAction, ThunkAction } from '@reduxjs/toolkit'

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<Action, ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action extends AnyAction ? Action : never
>
