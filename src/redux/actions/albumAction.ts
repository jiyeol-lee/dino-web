import type { ThunkAction } from 'redux-thunk'

import type { RootState } from '@/redux-types'
import { ActionType } from '@/redux-types/album'
import type { Action } from '@/redux-types/album'
import type { Category, Post } from '@/types/album'

export const setCategories = (
  categories: Category[]
): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.SET_CATEGORIES, categories })
  }
}

export const addCategory = (
  category: Category
): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.ADD_CATEGORY, category })
  }
}

export const editCategory = (
  id: string,
  category: Category | Pick<Category, 'name'>
): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.EDIT_CATEGORY, id, category })
  }
}

export const deleteCategory = (
  id: string
): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.DELETE_CATEGORY, id })
  }
}

export const setPostData = (
  total: number,
  posts: Post[]
): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.SET_POST_DATA, total, posts })
  }
}

export const addPost = (
  post: Post
): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.ADD_POST, post })
  }
}

export const deletePost = (
  id: string
): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch) => {
    dispatch({ type: ActionType.DELETE_POST, id })
  }
}
