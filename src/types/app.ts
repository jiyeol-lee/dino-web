import type { AxiosRequestConfig as _AxiosRequestConfig } from 'axios'

import { AccessLevels, AlertColor } from '@/constants/app'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AxiosRequestConfig = _AxiosRequestConfig<any>

export type ExceptId<T> = Omit<T, '_id'>

export type Color =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'default'

interface AccessUser {
  accessUserId: string
  accessLevel: AccessLevels
}

export interface User {
  _id: string
  name: string
  email: string
  emailVerified: null
  image: string
  // NOTE: 496-1
  accessLevel: {
    fa: AccessLevels
    mt: AccessLevels
  }
  createdAt: string
  updatedAt: string
}

export interface Project {
  _id: string
  title: string
  description: string
  ownerId: string
  createdAt: string
  updatedAt: string
  accessUsers: AccessUser[]
}

export interface ToastMessage {
  id: string
  severity: AlertColor
  message: string
}
