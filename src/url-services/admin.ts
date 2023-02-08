import { Modules } from '@/constants/app'

export const adminUrlService = {
  index: (module: Exclude<Modules, Modules.ADMIN>) =>
    `/admin/module/${module}/user-list`
}
