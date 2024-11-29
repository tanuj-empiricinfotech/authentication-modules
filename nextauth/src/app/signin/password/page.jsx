'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import TextField from '../../components/TextField'
import Button from '../../components/Button'
import GoogleSignInButton from '../../components/GoogleSignInButton'
import GithubSignInButton from '../../components/GithubSignInButton'
import ForgotPassword from '../../profile/component/ForgotPassword'

const PasswordSignInPage = () => {
  const router = useRouter()
  const { data: session } = useSession();

    if (session) {
      router.push("/"); // Redirect if logged in
    }
  
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    } else {
      // If no email is provided, redirect back to signin
      router.push('/signin')
    }
  }, [searchParams, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false // Prevent automatic redirect
      })

      console.log('Sign-in result:', result)

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        router.push('/') // Redirect after successful login
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  return (
    <section className='flex min-h-full overflow-hidden pt-16 sm:py-28'>
      <div className='mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6'>
        <div className='relative mt-12 sm:mt-16'>
          <h1 className='text-center text-2xl font-medium tracking-tight text-gray-900'>
            Enter your password
          </h1>
          <p className='text-center text-sm text-gray-600 mt-2'>
            Sign in to {email}
          </p>
        </div>
        <div className='sm:rounded-5xl -mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24'>
          <form onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <TextField
                id='email'
                name='email'
                type='email'
                label='Email'
                value={email}
                disabled
                readOnly
              />
              <TextField
                id='password'
                name='password'
                type='password'
                label='Password'
                placeholder='Your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='current-password'
                required
              />
            </div>
            {error && <p className='text-red-500 mt-2'>{error}</p>}
            <Button
              type='submit'
              variant='outline'
              color='gray'
              className='mt-3 w-full'
            >
              Continue
            </Button>
            <div className='mt-4 text-center'>
              <button
                type='button'
                className='text-sm text-gray-600 hover:text-gray-900'
                onClick={() => router.push(`/signin/forgot-password?email=${encodeURIComponent(email)}`)}
              >
                Forgot password?
              </button>
            </div>
          </form>
          <div className='mx-auto my-10 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
            or
          </div>
          <div className='flex flex-col gap-4'>
            <GoogleSignInButton />
            <GithubSignInButton />
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

export default PasswordSignInPage