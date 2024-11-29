import User from '@/src/model/user'
import { sendPasswordResetEmail } from '../../../../lib/email'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return new Response(
        JSON.stringify({ status: false, error: 'Email is required' }),
        { status: 400 }
      )
    }

    // Retrieve the user by email
    const user = await User.findOne({email})

    // Check if user exists
    if (!user) {
      return new Response(
        JSON.stringify({ status: false, error: 'User not found' }),
        { status: 404 }
      )
    }

    console.log('caugh user in reset', user, user.provider !== 'credentials', user.provider)

    // Check if the user's provider is 'credentials'
    if (user.provider !== 'credentials') {
      return new Response(
        JSON.stringify({ 
          status: false, 
          message: 'Password reset is not allowed for this account type. Please use your original authentication method.'
        }),
        { status: 403 }
      )
    }

    // Call the utility function to send the reset email
    await sendPasswordResetEmail(email)

    return new Response(
      JSON.stringify({
        status: true,
        message: 'Password reset email sent successfully'
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in reset password API:', error)
    return new Response(
      JSON.stringify({ status: false, error: 'Internal server error' }),
      { status: 500 }
    )
  }
}