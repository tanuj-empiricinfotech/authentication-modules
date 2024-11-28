'use client'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useState } from 'react'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import Image from 'next/image'
import ForgotPassword from './ForgotPassword'

const Profile = ({ initialUser }) => {
  const [isPassChange, setIsPassChange] = useState(false)
  const [viewOldPassword, setViewOldPassword] = useState(false)
  const [viewNewPassword, setViewNewPassword] = useState(false)
  const [showForgotPass, setshowForgotPass] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  function toggleDrawerPassword() {
    setIsPassChange(!isPassChange)
    setError(null)
    setSuccess(null)
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handlePasswordSubmit() {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setError('Both old and new passwords are required')
      return
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...passwordData, userId: initialUser.id })
      })

      const result = await response.json()

      if (result.status) {
        setSuccess('Password changed successfully')
        setPasswordData({
          oldPassword: '',
          newPassword: ''
        })
        setTimeout(() => {
          toggleDrawerPassword()
          setSuccess(null)
        }, 2000)
      } else {
        setError(result.message || 'Failed to change password')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className='relative mt-2 flex h-[900px] w-full flex-col items-center lg:h-[380px]'>
      <div className='shadow-profile flex h-[90%] w-full flex-col items-center justify-center rounded-lg lg:h-full lg:flex-row'>
        <div className='flex h-full w-full flex-col items-center lg:h-full lg:items-center lg:justify-normal'>
          <div className='h-[20%] w-full p-3 lg:h-auto'>
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className='w-fit cursor-pointer rounded-xl px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-100 active:scale-90 active:bg-stone-200 active:duration-100'
            >
              <FaArrowLeftLong size={'36px'} className='text-stone-500' />
            </div>
          </div>

          <div className='flex w-full flex-col justify-around md:flex-row'>
            <div className='relative flex h-[80%] w-full lg:w-fit flex-col items-center justify-center rounded-full lg:h-auto'>
              {initialUser?.image ? (
                <div className='relative h-[200px] w-[200px]'>
                  <Image
                    src={initialUser.image}
                    alt={initialUser.name}
                    className='inline-block rounded-full'
                    fill
                  />
                </div>
              ) : (
                <span className='inline-block h-[200px] w-[200px] overflow-hidden rounded-full bg-stone-100'>
                  <svg
                    className='h-full w-full text-stone-300'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                </span>
              )}
            </div>

            <div className='flex h-[57%] w-full flex-col px-5 py-4 lg:h-full lg:w-[60%]'>
              <div className='w-full lg:h-[10%]'>
                <p className='font-slab float-right font-bold text-stone-500'>
                  Joined On{' '}
                  {new Date(initialUser?.createdAt).toISOString().slice(0, 10)}
                </p>
              </div>

              <div className='flex w-full flex-col justify-center gap-5 lg:h-[90%]'>
                <fieldset className='w-[70%] rounded-xl border-[1.5px] border-gray-300 px-2 pb-1 pt-[2px] lg:px-4 lg:pb-[2px]'>
                  <legend className='font-Slab font-bold text-black lg:text-sm'>
                    Name
                  </legend>
                  <input
                    readOnly
                    value={initialUser?.name || 'N/A'}
                    className='font-roboto w-[80%] border-none bg-transparent text-xl font-semibold capitalize tracking-wide outline-none lg:text-lg'
                  />
                </fieldset>

                <fieldset className='w-[80%] rounded-xl border-[2px] px-4 py-2 pb-3'>
                  <legend className='font-slab font-bold text-black lg:text-sm'>
                    Email
                  </legend>
                  <h1 className='font-roboto text-lg font-semibold tracking-wide'>
                    {initialUser?.email || 'N/A'}
                  </h1>
                </fieldset>

                <Drawer
                  open={isPassChange}
                  onClose={toggleDrawerPassword}
                  direction='right'
                  size={450}
                  className='flex items-center'
                >
                  {!showForgotPass ? (
                    <div className='flex h-full w-full items-center justify-center p-6'>
                      <div className='w-full rounded-xl bg-white px-6 py-5'>
                        {error && (
                          <div className='mb-4 rounded bg-red-100 p-3 text-red-700'>
                            {error}
                          </div>
                        )}
                        {success && (
                          <div className='mb-4 rounded bg-green-100 p-3 text-green-700'>
                            {success}
                          </div>
                        )}

                        <label
                          htmlFor='oldpassword'
                          className='font-Nova mb-2 mt-4 text-[20px] font-bold capitalize text-gray-600'
                        >
                          Enter your old password
                        </label>

                        <div className='relative flex w-full items-center gap-2 rounded-[5px] border-[2px] border-black bg-transparent px-3'>
                          <input
                            onChange={handlePasswordChange}
                            className='w-full border-none bg-transparent py-2 focus:outline-0 focus:ring-0'
                            type={viewOldPassword ? 'text' : 'password'}
                            name='oldPassword'
                            id='oldpassword'
                            value={passwordData.oldPassword}
                          />
                          {viewOldPassword ? (
                            <FiEye
                              aria-label='Show Old Password'
                              className='cursor-pointer text-xl'
                              onClick={() => setViewOldPassword(false)}
                            />
                          ) : (
                            <FiEyeOff
                              aria-label='Hide Old Password'
                              className='cursor-pointer text-xl'
                              onClick={() => setViewOldPassword(true)}
                            />
                          )}
                        </div>

                        <label
                          htmlFor='newpassword'
                          className='font-Nova mb-2 mt-4 text-[20px] font-bold capitalize text-gray-600'
                        >
                          Create new password
                        </label>

                        <div className='relative flex w-full items-center gap-2 rounded-[5px] border-[2px] border-black bg-transparent px-3'>
                          <input
                            onChange={handlePasswordChange}
                            className='w-full border-none bg-transparent py-2 focus:outline-0 focus:ring-0'
                            type={viewNewPassword ? 'text' : 'password'}
                            name='newPassword'
                            id='newpassword'
                            value={passwordData.newPassword}
                          />
                          {viewNewPassword ? (
                            <FiEye
                              aria-label='Show New Password'
                              className='cursor-pointer text-xl'
                              onClick={() => setViewNewPassword(false)}
                            />
                          ) : (
                            <FiEyeOff
                              aria-label='Hide New Password'
                              className='cursor-pointer text-xl'
                              onClick={() => setViewNewPassword(true)}
                            />
                          )}
                        </div>

                        <div className='mt-2 flex w-full justify-end pl-1'>
                          <p
                            type='button'
                            onClick={() => {
                              setshowForgotPass(true)
                            }}
                            className='cursor-pointer text-lg font-semibold text-[#1877f2] hover:underline'
                          >
                            Forgotten password?
                          </p>
                        </div>

                        <div className='mt-6 flex w-full items-center gap-5'>
                          <button
                            onClick={handlePasswordSubmit}
                            className='rounded bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800'
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => {
                              setPasswordData({
                                oldPassword: '',
                                newPassword: ''
                              })
                              toggleDrawerPassword()
                            }}
                            className='rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600'
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ForgotPassword
                      hideForgotPass={() => setshowForgotPass(false)}
                      email={initialUser.email}
                    />
                  )}
                </Drawer>

                <button
                  onClick={toggleDrawerPassword}
                  className='mt-4 w-[40%] rounded bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800'
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
