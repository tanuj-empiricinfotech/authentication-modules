import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { MdEmail } from 'react-icons/md'

function ForgotPassword({ email, hideForgotPass }) {
  const router = useRouter()
  const pathname = usePathname()

  const [showSendMail, setShowSendMail] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState({
    email: ''
  })

  useEffect(() => {
    if (!email && pathname === '/forgot-password') {
      const forgotPass = document.getElementById('forgotPass')
      if (forgotPass) forgotPass.style.display = 'flex'
    }
  }, [email, pathname])

  function handleChange(e) {
    const { name, value } = e.target
    setRegisteredEmail({
      ...registeredEmail,
      [name]: value
    })
  }

  // Simple email validation regex
  const isEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function handleSubmit() {
    if (!registeredEmail.email) {
      alert('Please enter an email first')
      return
    }

    if (!isEmail(registeredEmail.email)) {
      alert('Invalid Email')
      return
    }

    setShowSendMail(true)
  }

  async function handleSendMail() {
    try {
      const res = await fetch('/api/user/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registeredEmail)
      })

      const response = await res.json()

      if (response?.status) {
        setRegisteredEmail({
          email: ''
        })
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
        router.push('/')
      } else {
        alert(response?.message || 'Something went wrong')
      }
    } catch (err) {
      alert('Error sending reset email')
    }
  }

  async function handleCurrentSubmit() {
    if (!email) {
      alert('User Is Not Logged In')
      return
    }

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
        hideForgotPass()
      } else {
        alert(response?.message || 'Something went wrong')
      }
    } catch (err) {
      alert('Error sending reset email')
    }
  }

  // Function to mask email
  const maskEmail = emailToMask => {
    if (!emailToMask) return ''
    const [username, domain] = emailToMask.split('@')
    const maskedUsername =
      username.length > 4
        ? username.slice(0, 2) +
          '*'.repeat(username.length - 4) +
          username.slice(-2)
        : username.slice(0, 1) + '*'.repeat(username.length - 1)
    return `${maskedUsername}@${domain}`
  }

  return email ? (
    <div className='font-Nova w-[80%] flex-col justify-center items-center h-fit bg-white px-4 py-5 text-center md:w-[60%] lg:w-full'>
      <div className='flex w-full flex-col items-center justify-center bg-transparent'>
        <h1 className='font-roboto my-4 text-2xl font-semibold tracking-wide'>
          We'll send you a mail to your registered email address
        </h1>

        <p className='font-Slab my-2 text-lg font-semibold tracking-wider text-blue-500'>
          {maskEmail(email)}
        </p>
      </div>

      <div
        style={{
          userSelect: 'none'
        }}
        className='mt-5 flex w-full items-center justify-center gap-5'
      >
        <button
          aria-label='Continue Reset Password Process'
          onClick={handleCurrentSubmit}
          className="shadow-logBtn relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-[5px] border-2  border-black bg-black px-3 py-2 text-xs font-bold text-white before:absolute before:bottom-0 before:left-0 before:right-full before:top-0 before:z-[4] before:bg-gradient-to-tr before:from-blue-400 before:via-blue-600 before:to-blue-800 before:transition-all before:ease-in-out before:content-[''] hover:border-white hover:before:right-0 lg:px-3 lg:py-[5px] lg:text-lg"
        >
          <span className='z-[5]'>Continue</span>
        </button>

        <button
          aria-label='Cancel Reset Password Process'
          onClick={() => {
            setRegisteredEmail({
              email: ''
            })
            hideForgotPass()
          }}
          className="shadow-logBtn relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-[5px] border-2 border-black px-3 py-2 text-xs font-bold before:absolute before:bottom-0 before:left-0 before:right-full before:top-0 before:z-[4] before:bg-gradient-to-tr before:from-red-400 before:via-red-600 before:to-red-800 before:transition-all before:ease-in-out before:content-[''] hover:border-white hover:text-white hover:before:right-0 lg:px-3 lg:py-[5px] lg:text-lg"
        >
          <span className='z-[5]'>Cancel</span>
        </button>
      </div>
    </div>
  ) : (
    <div className='w-[95%] flex-col justify-center rounded-xl bg-gradient-to-r from-zinc-950 to-zinc-700 px-6 py-5 self-center'>
      <label
        htmlFor='email'
        className='font-Nova  mb-6 mt-4 pl-1 font-bold tracking-wide text-gray-200 sm:text-xl'
      >
        Enter Your Registered Email
      </label>

      <div className='flex w-full items-center justify-center border-[4px] border-sky-500 bg-white px-3 focus-within:border-green-600'>
        <input
          onChange={handleChange}
          className='my-2 w-full border-none bg-transparent font-semibold focus:outline-0 focus:ring-0 sm:text-xl'
          type='email'
          name='email'
          id='email'
          value={registeredEmail.email}
        />
      </div>

      {showSendMail && (
        <div className='fixed bottom-0 left-0 right-0 top-0 z-30 flex items-center justify-center bg-gradient-to-r from-[#00000095] to-[#00000095]'>
          <div className='flex w-[90%] flex-col justify-center rounded-xl bg-white px-6 py-8 text-center'>
            <h1 className='font-poppins font-bold tracking-wide text-zinc-600 sm:text-xl'>
              We will send you mail to the provided registered email address
            </h1>
            <p className='font-slab my-5 flex items-center justify-center gap-1 tracking-wider text-blue-600 sm:text-xl'>
              <MdEmail size={'30px'} />
              {registeredEmail.email}
            </p>

            <hr className='my-2 border-b-[1.5px] sm:my-4' />

            <div className='flex w-full items-center justify-center gap-5'>
              <button
                aria-label='Send Mail'
                onClick={handleSendMail}
                className='font-poppins w-fit self-center rounded-xl bg-gradient-to-t from-indigo-900 via-indigo-600 to-indigo-400 px-5 py-3 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:bg-gradient-to-t hover:from-indigo-400 hover:via-indigo-600 hover:to-indigo-900 sm:text-xl'
              >
                OK
              </button>
              <button
                aria-label='Change Email Address'
                onClick={() => {
                  setRegisteredEmail({
                    email: ''
                  })
                  setShowSendMail(false)
                }}
                className='font-poppins w-fit self-center rounded-xl bg-gradient-to-t from-orange-900 via-orange-600 to-orange-400 px-5 py-3 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:bg-gradient-to-t hover:from-orange-400 hover:via-orange-600 hover:to-orange-900 sm:text-xl'
              >
                CHANGE EMAIL
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          userSelect: 'none'
        }}
        className='mt-8 flex w-full items-center gap-4 sm:gap-5'
      >
        <button
          aria-label='Send Mail to Registered Email Address'
          onClick={handleSubmit}
          className='font-roboto rounded-lg bg-gradient-to-t from-blue-800 via-blue-600 to-blue-400 px-4 py-2 font-bold text-white transition-all duration-300 hover:scale-110 hover:bg-gradient-to-t hover:from-blue-400 hover:via-blue-600 hover:to-blue-800 sm:px-10'
        >
          CONTINUE
        </button>

        <button
          aria-label='Cancel Reset Password Process'
          onClick={() => {
            setRegisteredEmail({
              email: ''
            })
            hideForgotPass()
          }}
          className='font-roboto rounded-lg bg-gradient-to-t from-red-800 via-red-600 to-red-400 px-4 py-2 font-bold text-white transition-all duration-300 hover:scale-110 hover:bg-gradient-to-t hover:from-red-400 hover:via-red-600 hover:to-red-800 sm:px-10'
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
