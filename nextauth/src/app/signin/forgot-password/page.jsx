'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import 'react-modern-drawer/dist/index.css'
import { MdEmail } from 'react-icons/md'
import Button from '../../components/Button'
import GoogleSignInButton from '../../components/GoogleSignInButton'
import GithubSignInButton from '../../components/GithubSignInButton'
import { FiLoader } from 'react-icons/fi'
import { useSession } from 'next-auth/react'

const PasswordSignInPage = () => {
  const router = useRouter()
  const { data: session } = useSession();

    if (session) {
      router.push("/"); // Redirect if logged in
    }
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(null)
  const [isLoding, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      setMessage(`Sign In to ${emailParam}`)
    } else {
      // If no email is provided, redirect back to signin
      router.push('/signin')
    }
  }, [searchParams, router])

  const handlEmailSent = async email => {
    setIsLoading(true)

    try {
      const res = await fetch('/api/user/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      const response = await res.json()

      if (response?.status) {
        setIsLoading(false);
        setMessage(`Email sent to ${email}`)
      }
    } catch (err) {
      setIsLoading(false)
      setMessage(`Enable to sent email to ${email}`)
    }
  }

  return (
    <section className='flex min-h-full overflow-hidden pt-16 sm:py-28'>
      <div className='mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6'>
        <div className='relative mt-12 sm:mt-16'>
          <h1 className='flex items-center justify-center gap-5 text-center text-2xl font-medium tracking-tight text-gray-900'>
            {message || (
              <>
                Sign In To <FiLoader size={20} className='animate-spin' />
              </>
            )}
          </h1>
        </div>
        <div className='sm:rounded-5xl -mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24'>
          <Button
            type='submit'
            variant='outline'
            color='gray'
            className='mt-3 flex w-full items-center justify-center gap-2'
            onClick={() => handlEmailSent(email)}
          >
            {isLoding ? (
              'Sending Email....'
            ) : (
              <>
                <MdEmail size={20} /> Email code to{' '}
                {email || <FiLoader size={15} className='animate-spin' />}
              </>
            )}
          </Button>
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
