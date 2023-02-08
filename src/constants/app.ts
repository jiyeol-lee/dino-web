export const DRAWER_WIDTH = 280

export const COOKIES_OPTION = {
  // day hour minute second
  maxAge: 365 * 24 * 60 * 60,
  path: '/'
}

export enum Actions {
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}

export enum S3Paths {
  ALBUM = 'album/'
}

export enum FileTypes {
  IMAGE = 'image',
  // AUDIO = 'audio',
  VIDEO = 'video'
}

export enum FileExtensions {
  PNG = 'png',
  JPEG = 'jpeg',
  HEIC = 'heic',
  MP4 = 'mp4',
  MOV = 'mov'
}

export enum FileInputExtensions {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  HEIC = 'image/heic',
  MP4 = 'video/mp4',
  MOV = 'video/quicktime'
}

export enum Locales {
  EN = 'en',
  KR = 'kr'
}

export enum AccessLevels {
  NONE = '0',
  VIEWER = '1',
  COMMENTOR = '2',
  EDITOR = '5',
  ADMIN = '9',
  SUPER_ADMIN = '10'
}

// NOTE: 496-1
export enum Apps {
  FAMILY_ALBUM = 'fa',
  COMPONENTS = 'cp'
}

export enum Modules {
  ADMIN = 'admin',
  FAMILY_ALBUM = 'family-album'
}

export enum AlertColor {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export enum DeviceType {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'smartphone'
}
