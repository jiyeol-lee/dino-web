import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut
} from 'next-auth/react'
import type { ComponentType } from 'react'

import { useCurrentUser } from '@/hooks/useHttpApp'

import type { HeaderAuthProps } from './HeaderAuth'

export const withSignInOutHandler = <T extends HeaderAuthProps>(
  WrappedComponent: ComponentType<T>
) => {
  const ComponentHoc = (props: Pick<T, never>) => {
    const { user } = useCurrentUser()

    const signInWithGoogle = () => {
      nextAuthSignIn('google')
    }

    const signOut = () => {
      nextAuthSignOut({ callbackUrl: '/' })
    }

    return (
      <WrappedComponent
        {...(props as T)}
        isSignedIn={!!user}
        signIn={signInWithGoogle}
        signOut={signOut}
      />
    )
  }

  ComponentHoc.displayName = `${WrappedComponent.displayName}WithSignInOutHandler`

  return ComponentHoc
}
