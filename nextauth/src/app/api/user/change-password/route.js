import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import User from '@/src/model/user';
import bcrypt from 'bcryptjs';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(request) {
  try {
    // First, retrieve the current session
    const session = await getServerSession(authOptions);

    // Check if user is logged in
    if (!session) {
      return NextResponse.json({ 
        status: false, 
        error: 'Not logged in' 
      }, { status: 401 });
    }

    // Check if the login provider is credentials
    if (session.user?.provider !== 'credentials') {
      return NextResponse.json({ 
        status: false, 
        error: 'Password change is not allowed for this account type' 
      }, { status: 403 });
    }

    const body = await request.json();
    const { oldPassword, newPassword } = body;

    // Validate input fields
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ 
        status: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Find the user using the session's user ID
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ 
        status: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Verify the old password
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ 
        status: false, 
        message: 'Old password does not match' 
      }, { status: 401 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      status: true,
      message: 'Password changed successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({
      status: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}