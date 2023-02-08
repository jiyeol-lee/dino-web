import type { AxiosRequestConfig } from 'axios'
import { useTranslation } from 'next-i18next'
import { append, compose, map } from 'ramda'
import { useCallback } from 'react'
import useSWR, { useSWRConfig } from 'swr'

import { POST_PAGE_SIZE } from '@/constants/album'
import { AlertColor, S3Paths } from '@/constants/app'
import albumHttpService from '@/http-services/album'
import {
  enqueueAlert,
  resetPostUploadStatus,
  setPostUploadStatus,
  updatePostUploadStatus
} from '@/redux-actions'
import type { Asset, Category, Post, PostForm } from '@/types/album'
import { sortCategoriesAlphabetically } from '@/utils/album'
import { generateUuid } from '@/utils/app'
import { deleteFilesObject, uploadFile } from '@/utils/file'

import { usePostPageQueryParams } from './usePostPageQueryParams'
import { useAppDispatch } from './useRedux'

export const useCategories = ({ isReady }: { isReady: boolean }) => {
  const { data, error, isValidating } = useSWR<Category[]>(
    isReady ? albumHttpService.getCategoriesUrl() : null
  )

  return {
    isLoading: data === undefined && error === undefined,
    isValidating,
    isError: !!error,
    categories: data ?? []
  }
}

export const useCreateCategory = () => {
  const { t } = useTranslation('common')
  const dispatch = useAppDispatch()
  const { mutate } = useSWRConfig()

  const execute = useCallback(
    async (values: Omit<Category, '_id'>) => {
      const getNewCategories = (
        newCategory: Category,
        categories: Category[]
      ): Category[] =>
        compose(sortCategoriesAlphabetically, append(newCategory))(categories)

      return mutate(
        albumHttpService.getCategoriesUrl(),
        albumHttpService.createCategory({ values }),
        {
          optimisticData: (categories: Category[]) => {
            const uuid = generateUuid()

            return getNewCategories({ _id: uuid, ...values }, categories)
          },
          populateCache: (category: Category, categories: Category[]) => {
            return getNewCategories(category, categories)
          },
          rollbackOnError: true
        }
      ).catch((error) => {
        dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))

        throw error
      })
    },
    [mutate, dispatch, t]
  )

  return { execute }
}

export const useUpdateCategory = () => {
  const { t } = useTranslation('common')
  const dispatch = useAppDispatch()
  const { mutate } = useSWRConfig()

  const execute = useCallback(
    async (id: string, values: Omit<Category, '_id'>) => {
      const getNewCategories = (categories: Category[]): Category[] =>
        compose(
          sortCategoriesAlphabetically,
          map((category: Category) =>
            category._id === id ? { ...category, ...values } : category
          )
        )(categories)

      return mutate(
        albumHttpService.getCategoriesUrl(),
        albumHttpService.updateCategory({ id, values }),
        {
          optimisticData: (categories: Category[]) => {
            return getNewCategories(categories)
          },
          populateCache: (_, categories: Category[]) => {
            return getNewCategories(categories)
          },
          rollbackOnError: true
        }
      ).catch((error) => {
        dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))

        throw error
      })
    },
    [mutate, dispatch, t]
  )

  return { execute }
}

export const useDeleteCategory = () => {
  const { t } = useTranslation('common')
  const dispatch = useAppDispatch()
  const { mutate } = useSWRConfig()

  const execute = useCallback(
    async (id: string) => {
      const getNewCategories = (categories: Category[]): Category[] =>
        categories.filter((category) => category._id !== id)

      return mutate(
        albumHttpService.getCategoriesUrl(),
        albumHttpService.deleteCategory({ id }),
        {
          optimisticData: (categories: Category[]) => {
            return getNewCategories(categories)
          },
          populateCache: (_, categories: Category[]) => {
            return getNewCategories(categories)
          },
          rollbackOnError: true
        }
      ).catch((error) => {
        dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))

        throw error
      })
    },
    [mutate, dispatch, t]
  )

  return { execute }
}

export const usePostsTotal = ({
  isReady,
  qpCategoryId
}: {
  isReady: boolean
  qpCategoryId?: string
}) => {
  const { data, error, isValidating } = useSWR<number>(
    isReady ? albumHttpService.getPostsTotalUrl({ qpCategoryId }) : null
  )

  return {
    isLoading: data === undefined && error === undefined,
    isValidating,
    isError: !!error,
    total: data,
    totalPage: data !== undefined ? Math.ceil(data / POST_PAGE_SIZE) : undefined
  }
}

export const usePosts = ({
  isReady,
  qpPage,
  qpCategoryId
}: {
  isReady: boolean
  qpPage: number
  qpCategoryId?: string
}) => {
  const { data, error, isValidating } = useSWR<Post[]>(
    isReady ? albumHttpService.getPostsUrl({ qpPage, qpCategoryId }) : null
  )

  return {
    isLoading: data === undefined && error === undefined,
    isValidating,
    isError: !!error,
    posts: data ?? []
  }
}

export const useCreatePost = () => {
  const { t } = useTranslation('common')
  const dispatch = useAppDispatch()
  const { postPageQueryParams } = usePostPageQueryParams()
  const { mutate } = useSWRConfig()

  const execute = useCallback(
    async (values: PostForm) => {
      dispatch(
        setPostUploadStatus(
          Array.from(values.files!).map(() => ({ progress: 0 }))
        )
      )

      return mutate(
        albumHttpService.getPostsUrl({
          qpPage: postPageQueryParams.qpPage,
          qpCategoryId: postPageQueryParams.qpCategoryId
        }),
        Promise.all(
          Array.from(values.files!).map((file, index) => {
            const config: AxiosRequestConfig = {
              onUploadProgress: (progressEvent) => {
                const percentCompleted =
                  progressEvent.loaded / progressEvent.total

                dispatch(
                  updatePostUploadStatus(index, { progress: percentCompleted })
                )
              }
            }

            return uploadFile(file, S3Paths.ALBUM, config)
          })
        ).then((uploadedFiles) =>
          albumHttpService
            .createPost({
              values: {
                title: values.title,
                description: values.description,
                audience: values.audience,
                categories: values.categories,
                assets: uploadedFiles
              }
            })
            .catch((error) => {
              dispatch(resetPostUploadStatus())
              // if something wrong on the database,
              // delete all files uploaded
              deleteFilesObject(uploadedFiles.map((file) => file.key))

              throw error
            })
        ),
        {
          populateCache: (_, posts: Post[]) => {
            mutate(albumHttpService.getPostsTotalUrl(), undefined, {
              optimisticData: (total: number) => {
                return total + 1
              },
              populateCache: (_, total: number) => {
                return total + 1
              },
              rollbackOnError: true
            })

            return posts
          }
        }
      ).catch((error) => {
        dispatch(resetPostUploadStatus())
        dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))

        throw error
      })
    },
    [mutate, dispatch, t, postPageQueryParams]
  )

  return { execute }
}

export const useUpdatePost = () => {
  const { t } = useTranslation('common')
  const dispatch = useAppDispatch()
  const { postPageQueryParams } = usePostPageQueryParams()
  const { mutate } = useSWRConfig()

  const execute = useCallback(
    async (id: string, categories: Category[], values: PostForm) => {
      return mutate(
        albumHttpService.getPostsUrl({
          qpPage: postPageQueryParams.qpPage,
          qpCategoryId: postPageQueryParams.qpCategoryId
        }),
        albumHttpService.updatePost({ id, values }),
        {
          optimisticData: (posts: Post[]) => {
            return posts.map((post) =>
              post._id === id
                ? {
                    ...post,
                    title: values.title,
                    description: values.description,
                    audience: values.audience,
                    categories: values.categories
                      .map((categoryId) =>
                        categories.find(
                          (category) => category._id === categoryId
                        )
                      )
                      .filter((category) => category !== undefined)
                  }
                : post
            )
          },
          populateCache: (newPost: Post, posts: Post[]) => {
            return posts.map((post) => (post._id === id ? newPost : post))
          },
          rollbackOnError: true
        }
      ).catch((error) => {
        dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))

        throw error
      })
    },
    [mutate, dispatch, t, postPageQueryParams]
  )

  return { execute }
}

export const useDeletePost = () => {
  const { t } = useTranslation('common')
  const dispatch = useAppDispatch()
  const { postPageQueryParams } = usePostPageQueryParams()
  const { mutate } = useSWRConfig()

  const execute = useCallback(
    async (id: string, assetKeys: string[]) => {
      const getNewPosts = (posts: Post[]): Post[] =>
        posts.filter((post) => post._id !== id)

      return mutate(
        albumHttpService.getPostsUrl({
          qpPage: postPageQueryParams.qpPage,
          qpCategoryId: postPageQueryParams.qpCategoryId
        }),
        albumHttpService.deletePost({ id }).then((post) => {
          deleteFilesObject(assetKeys)

          return post
        }),
        {
          optimisticData: (posts: Post[]) => {
            return getNewPosts(posts)
          },
          populateCache: (_, posts: Post[]) => {
            mutate(albumHttpService.getPostsTotalUrl(), undefined, {
              optimisticData: (total: number) => {
                return total - 1
              },
              populateCache: (_, total: number) => {
                return total - 1
              },
              rollbackOnError: true
            })

            return getNewPosts(posts)
          },
          rollbackOnError: true
        }
      ).catch((error) => {
        dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))

        throw error
      })
    },
    [mutate, dispatch, t, postPageQueryParams]
  )

  return { execute }
}

export const useAsset = ({
  isReady,
  assetId
}: {
  isReady: boolean
  assetId: string
}) => {
  const { data, error, isValidating } = useSWR<Asset>(
    isReady ? albumHttpService.getAssetUrl({ id: assetId }) : null
  )

  return {
    isLoading: data === undefined && error === undefined,
    isValidating,
    isError: !!error,
    asset: data!
  }
}
