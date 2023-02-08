import axios from 'axios'

import { Apps } from '@/constants/app'
import type { AxiosRequestConfig } from '@/types'
import type {
  Asset,
  Category,
  Post,
  PostForm,
  PostRequest
} from '@/types/album'

const albumHttpService = {
  getCategoriesUrl() {
    return `${process.env.PAGE_URL ?? ''}/api/app/${
      Apps.FAMILY_ALBUM
    }/album/category`
  },
  async createCategory(
    data: {
      values: Pick<Category, 'name'>
    },
    config?: AxiosRequestConfig
  ): Promise<Category> {
    return axios
      .post<Category>(
        `${process.env.PAGE_URL ?? ''}/api/app/${
          Apps.FAMILY_ALBUM
        }/album/category`,
        data.values,
        config
      )
      .then((res) => res.data)
  },
  async updateCategory(
    data: {
      id: string
      values: Omit<Category, '_id'>
    },
    config?: AxiosRequestConfig
  ): Promise<Category> {
    return axios
      .put<Category>(
        `${process.env.PAGE_URL ?? ''}/api/app/${
          Apps.FAMILY_ALBUM
        }/album/category/${data.id}`,
        data.values,
        config
      )
      .then((res) => res.data)
  },
  async deleteCategory(
    data: {
      id: string
    },
    config?: AxiosRequestConfig
  ): Promise<Category> {
    return axios
      .delete<Category>(
        `${process.env.PAGE_URL ?? ''}/api/app/${
          Apps.FAMILY_ALBUM
        }/album/category/${data.id}`,
        config
      )
      .then((res) => res.data)
  },
  getPostsTotalUrl(data: { qpCategoryId?: string } = {}) {
    return `${process.env.PAGE_URL ?? ''}/api/app/${
      Apps.FAMILY_ALBUM
    }/album/post/total?${
      data.qpCategoryId ? `qpCategoryId=${data.qpCategoryId}` : ''
    }`
  },
  getPostsUrl(data: { qpPage: number; qpCategoryId?: string }) {
    return (
      `${process.env.PAGE_URL ?? ''}/api/app/${
        Apps.FAMILY_ALBUM
      }/album/post?qpPage=${data.qpPage}` +
      (data.qpCategoryId ? `&qpCategoryId=${data.qpCategoryId}` : '')
    )
  },
  async getPostsTotal(config?: AxiosRequestConfig): Promise<number> {
    return axios
      .get<number>(this.getPostsTotalUrl(), config)
      .then((res) => res.data)
  },
  async createPost(
    data: {
      values: PostRequest
    },
    config?: AxiosRequestConfig
  ): Promise<Post> {
    return axios
      .post<Post>(
        `${process.env.PAGE_URL ?? ''}/api/app/${Apps.FAMILY_ALBUM}/album/post`,
        data.values,
        config
      )
      .then((res) => res.data)
  },
  async updatePost(
    data: {
      id: string
      values: PostForm
    },
    config?: AxiosRequestConfig
  ): Promise<Post> {
    return axios
      .put<Post>(
        `${process.env.PAGE_URL ?? ''}/api/app/${
          Apps.FAMILY_ALBUM
        }/album/post/${data.id}`,
        data.values,
        config
      )
      .then((res) => res.data)
  },
  async deletePost(
    data: {
      id: string
    },
    config?: AxiosRequestConfig
  ): Promise<Post> {
    return axios
      .delete<Post>(
        `${process.env.PAGE_URL ?? ''}/api/app/${
          Apps.FAMILY_ALBUM
        }/album/post/${data.id}`,
        config
      )
      .then((res) => res.data)
  },
  getAssetUrl(data: { id: string }) {
    return `${process.env.PAGE_URL ?? ''}/api/app/${
      Apps.FAMILY_ALBUM
    }/album/asset/${data.id}`
  },
  async getAsset(
    data: {
      id: string
    },
    config?: AxiosRequestConfig
  ): Promise<Asset> {
    return axios
      .get<Asset>(this.getAssetUrl({ id: data.id }), config)
      .then((res) => res.data)
  }
}

export default albumHttpService
