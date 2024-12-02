'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import TextField from '../../components/TextField'
import Button from '../../components/Button'
import GoogleSignInButton from '../../components/GoogleSignInButton'
import GithubSignInButton from '../../components/GithubSignInButton'
import { FiEyeOff } from 'react-icons/fi'
import { FaEye } from 'react-icons/fa6'
import {
  saveRememberedCredentials,
  clearRememberedCredentials,
  getRememberedCredentials
} from '../../../lib/rememberme' // Adjust import path as needed

const PasswordSignInPage = () => {
  const router = useRouter()
  const { data: session } = useSession()

  if (session) {
    router.push('/') // Redirect if logged in
  }

  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Check for remembered credentials on component mount
  useEffect(() => {
    const emailParam = searchParams.get('email')

    if (emailParam) {
      setEmail(emailParam)

      const rememberedCredentials = getRememberedCredentials();
      if (rememberedCredentials) {
        setPassword(rememberedCredentials.password)
        setRememberMe(true)
      }
    } else {
      // If no email is provided and no remembered credentials, redirect back to signin
      router.push('/signin')
    }
  }, [searchParams, router])

  const handleSubmit = async e => {
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
        // Handle "Remember Me" functionality
        if (rememberMe) {
          saveRememberedCredentials(email, password)
        } else {
          clearRememberedCredentials()
        }

        router.push('/') // Redirect after successful login
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <section className='flex min-h-full overflow-hidden pt-16 sm:py-28'>
      <div className='mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6'>
        <div className='relative mt-12 sm:mt-16'>
          <h1 className='text-center text-2xl font-medium tracking-tight text-gray-900'>
            Enter your password
          </h1>
          <p className='mt-2 text-center text-sm text-gray-600'>
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

              <div className='relative flex w-full items-center'>
                <TextField
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  label='Password'
                  placeholder='Your password'
                  value={password}
                  className={'w-full'}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete='current-password'
                  required
                  maxLength={20}
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none'
                >
                  {showPassword ? (
                    <FiEyeOff className='h-4 w-4' />
                  ) : (
                    <FaEye className='h-4 w-4' />
                  )}
                </button>
              </div>

              {/* Remember Me Checkbox */}
              <div className='mt-2 flex items-center'>
                <input
                  id='remember-me'
                  type='checkbox'
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-900'
                >
                  Remember me
                </label>
              </div>
            </div>
            {error && <p className='mt-2 text-red-500'>{error}</p>}
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
                onClick={() =>
                  router.push(
                    `/signin/forgot-password?email=${encodeURIComponent(email)}`
                  )
                }
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
    </section>
  )
}

export default PasswordSignInPage
