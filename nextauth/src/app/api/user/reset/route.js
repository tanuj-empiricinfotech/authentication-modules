import { sendPasswordResetEmail } from "../../../../lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({status: false, error: 'Email is required' }), { status: 400 });
    }

    // Call the utility function to send the reset email
    await sendPasswordResetEmail(email);

    return new Response(JSON.stringify({status: true, message: 'Password reset email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error in reset password API:', error);
    return new Response(JSON.stringify({status: false, error: 'Internal server error' }), { status: 500 });
  }
}
