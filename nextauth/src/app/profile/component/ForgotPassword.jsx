
function ForgotPassword({ email, hideForgotPass }) {
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

  return (
    <div className='font-Nova w-[95%] flex-col justify-center items-center h-fit bg-white px-4 py-5 text-center lg:w-full'>
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
            hideForgotPass()
          }}
          className="shadow-logBtn relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-[5px] border-2 border-black px-3 py-2 text-xs font-bold before:absolute before:bottom-0 before:left-0 before:right-full before:top-0 before:z-[4] before:bg-gradient-to-tr before:from-red-400 before:via-red-600 before:to-red-800 before:transition-all before:ease-in-out before:content-[''] hover:border-white hover:text-white hover:before:right-0 lg:px-3 lg:py-[5px] lg:text-lg"
        >
          <span className='z-[5]'>Cancel</span>
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword;
