import { useTranslation } from 'next-i18next'
import type { TFunction } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import type { GridColDef } from '@mui/x-data-grid'

import { AccessLevels, AlertColor, Apps } from '@/constants/app'
import { useIsAdminOrAbove } from '@/hooks/usePermission'
import { useAppDispatch } from '@/hooks/useRedux'
import { useUserAccessLevel } from '@/hooks/useUserAccessLevel'
import adminUserHttpService from '@/http-services/adminUser'
import { enqueueAlert } from '@/redux-actions'
import type { User } from '@/types'

const getAdminPermissionOptions = (t: TFunction) => [
  {
    label: t(`PERMISSION_LABEL_${AccessLevels.EDITOR}`),
    value: AccessLevels.EDITOR
  },
  {
    label: t(`PERMISSION_LABEL_${AccessLevels.COMMENTOR}`),
    value: AccessLevels.COMMENTOR
  },
  {
    label: t(`PERMISSION_LABEL_${AccessLevels.VIEWER}`),
    value: AccessLevels.VIEWER
  },
  {
    label: t(`PERMISSION_LABEL_${AccessLevels.NONE}`),
    value: AccessLevels.NONE
  }
]

const getSuperAdminPermissionOptions = (t: TFunction) =>
  [
    {
      label: t(`PERMISSION_LABEL_${AccessLevels.ADMIN}`),
      value: AccessLevels.ADMIN
    }
  ].concat(getAdminPermissionOptions(t))

export const useRowsAndCols = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [rows, setRows] = useState<User[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const { userAccessLevel } = useUserAccessLevel()
  const { isAdminOrAbove } = useIsAdminOrAbove()
  const appAbbreviation = router.query.appAbbreviation as Apps

  const valueOptions = useMemo(() => {
    if (userAccessLevel === AccessLevels.SUPER_ADMIN) {
      return getSuperAdminPermissionOptions(t)
    }

    if (userAccessLevel === AccessLevels.ADMIN) {
      return getAdminPermissionOptions(t)
    }

    return []
  }, [t, userAccessLevel])

  const refinedColumns: GridColDef[] = useMemo(
    () => [
      {
        field: 'image',
        headerName: t('THUMBNAIL'),
        headerAlign: 'center',
        align: 'center',
        width: 100,
        filterable: false,
        sortable: false,
        renderCell: (params) => <Avatar alt="" src={params.row.image} />
      },
      {
        field: 'name',
        headerName: t('NAME'),
        headerAlign: 'center',
        align: 'center',
        width: 200,
        filterable: false,
        sortable: false
      },
      {
        field: 'email',
        headerName: t('EMAIL'),
        headerAlign: 'center',
        align: 'center',
        width: 250,
        filterable: false,
        sortable: false
      },
      {
        field: 'permission',
        headerName: t('PERMISSION'),
        headerAlign: 'center',
        align: 'center',
        width: 200,
        editable: true,
        filterable: false,
        sortable: false,
        type: 'singleSelect',
        valueOptions,
        valueFormatter: (params) => t(`PERMISSION_LABEL_${params.value}`),
        valueSetter: (params) => {
          setRows((prevRows) =>
            prevRows!.map((prevRow) =>
              prevRow?._id === params.row._id
                ? {
                    ...prevRow,
                    accessLevel: {
                      ...prevRow.accessLevel,
                      [appAbbreviation as Apps]: params.value as AccessLevels
                    }
                  }
                : prevRow
            )
          )

          adminUserHttpService
            .editUserPermission({
              appAbbreviation,
              userId: params.row._id,
              value: params.value
            })
            .catch(() => {
              adminUserHttpService
                .getUsers({ appAbbreviation })
                .then((users) => {
                  setRows(users)
                })

              dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))
            })

          return {
            ...params.row,
            accessLevel: {
              ...params.row.accessLevel,
              [appAbbreviation as Apps]: params.value as AccessLevels
            }
          }
        }
      }
    ],
    [setRows, valueOptions, t, appAbbreviation, dispatch]
  )

  const refinedRows = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        id: row._id,
        permission: row.accessLevel[appAbbreviation]
      })),
    [rows, appAbbreviation]
  )

  useEffect(() => {
    if (!isAdminOrAbove) {
      return
    }

    setLoading(true)

    adminUserHttpService
      .getUsers({ appAbbreviation })
      .then((users) => {
        setLoading(false)
        setRows(users)
      })
      .catch(() => {
        setLoading(false)
        setRows([])

        dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))
      })
  }, [dispatch, appAbbreviation, t, isAdminOrAbove])

  return { isLoading, rows: refinedRows, columns: refinedColumns }
}
