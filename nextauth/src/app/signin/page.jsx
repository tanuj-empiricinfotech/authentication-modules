'use client'

import Button from '../components/Button'
import GoogleSignInButton from '../components/GoogleSignInButton'
import TextField from '../components/TextField'
import SignInOrSignUpButton from '../components/SignInOrSignUp'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import ForgotPassword from '../profile/component/ForgotPassword'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'


const SignInPage = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      callbackUrl:'/',
      redirect: true
    })

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/') // Redirect after successful login
    }
  }

  return (
    <section className='flex min-h-full overflow-hidden pt-16 sm:py-28'>
      <div className='mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6'>
        <div className='relative mt-12 sm:mt-16'>
          <h1 className='text-center text-2xl font-medium tracking-tight text-gray-900'>
            Sign in to your account
          </h1>
        </div>
        <div className='sm:rounded-5xl -mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24'>
          <form onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <TextField
                id='email'
                name='email'
                type='email'
                label='Sign in with your email'
                placeholder='hello@me.com'
                autoComplete='email'
                required
              />
              <TextField
                id='password'
                name='password'
                type='password'
                label='Password'
                placeholder='Your password'
                autoComplete='current-password'
                required
              />
            </div>
            {error && <p className='text-red-500'>{error}</p>}
            <Button
              type='submit'
              variant='outline'
              color='gray'
              className='mt-3 w-full'
            >
              Continue with email
            </Button>
          </form>
          <div className='mx-auto my-10 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
            or
          </div>
          <div className='flex flex-col gap-4'>
            <Button
              type='submit'
              variant='outline'
              color='gray'
              className='mt-3 w-full'
              onClick={() => {
                setShowForgotPassword(true)
              }}
            >
              Forgot Password
            </Button>
            <SignInOrSignUpButton show={'signup'} />
            <GoogleSignInButton />
          </div>
        </div>
      </div>

      {showForgotPassword && (
        <Drawer
          open={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
          direction='right'
          size={450}
          className='flex items-center justify-center'
        >
          <ForgotPassword hideForgotPass={() => setShowForgotPassword(false)} />
        </Drawer>
      )}
    </section>
  )
}

export default SignInPage
