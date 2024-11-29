'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '../components/Button'
import TextField from '../components/TextField'
import SignInOrSignUpButton from '../components/SignInOrSignUp'
import GoogleSignInButton from '../components/GoogleSignInButton'
import GithubSignInButton from '../components/GithubSignInButton'
import { checkEmailExists } from '../../lib/auth_helpers'
import { useSession } from 'next-auth/react'

const SignInPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

    if (session) {
      router.push("/"); // Redirect if logged in
    }
  
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true) // Start loading

    try {
      const exists = await checkEmailExists(email)
      
      if (exists) {
        // Email exists, navigate to password page
        router.push(`/signin/password?email=${encodeURIComponent(email)}`)
      } else {
        // Email doesn't exist, redirect to signup
        setError("Email is not registered. Please sign up.")
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false) // Stop loading
    }
  }

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value
    setEmail(inputEmail)
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(inputEmail))
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
          <form onSubmit={handleEmailSubmit}>
            <div className='space-y-2'>
              <TextField
                id='email'
                name='email'
                type='email'
                label='Sign in with your email'
                placeholder='hello@me.com'
                autoComplete='email'
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            {error && <p className='text-red-500 mt-2'>{error}</p>}
            <Button
              type='submit'
              variant='outline'
              color='gray'
              className='mt-3 w-full'
              disabled={!isEmailValid || isLoading} // Disable while loading
            >
              {isLoading ? 'Checking...' : 'Continue'} {/* Show loading text */}
            </Button>
          </form>
          <div className='mx-auto my-10 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
            or
          </div>
          <div className='flex flex-col gap-4'>
            <SignInOrSignUpButton show={'signup'} />
            <GoogleSignInButton />
            <GithubSignInButton />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignInPage
