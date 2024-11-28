import { NextResponse } from 'next/server';
import { updatePassword } from '@/lib/auth'; // Utility function to handle password update
import { verifyResetToken } from '@/lib/token'; // Function to verify the reset token

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    // Step 1: Verify the token
    const user = await verifyResetToken(token);
    if (!user) {
      return NextResponse.json(
        { status: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Step 2: Update the password
    const isPasswordUpdated = await updatePassword(user.email, newPassword);
    if (!isPasswordUpdated) {
      return NextResponse.json(
        { status: false, message: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Step 3: Return success response
    return NextResponse.json(
      { status: true, message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
