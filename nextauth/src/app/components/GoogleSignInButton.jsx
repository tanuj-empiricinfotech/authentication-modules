'use client'

import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { FcGoogle } from "react-icons/fc";


import Button from './Button'

// Google Sign-In Button Component
export const GoogleSignInButton = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  return (
    <Button
      className='w-full flex justify-center items-center gap-4'
      onClick={() => signIn('google', { 
        callbackUrl: callbackUrl 
      })}
      variant='outline'
    >
      <FcGoogle size={25} />
     Continue with Google
    </Button>
  )
}

export default GoogleSignInButton;