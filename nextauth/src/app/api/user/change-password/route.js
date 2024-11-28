import { NextResponse } from 'next/server';
import { updatePassword } from '../../../../lib/updatePassword';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, oldPassword, newPassword } = body;

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json({ status: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Perform your logic to change the password, e.g., verify old password, hash new password, update database.
     await updatePassword(userId, oldPassword, newPassword);

    return NextResponse.json({status: true,message: 'Password changed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({status: false, error: 'Internal server error' }, { status: 500 });
  }
}
