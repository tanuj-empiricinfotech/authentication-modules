import jwt from 'jsonwebtoken';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '@/src/model/user';

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key';

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { status: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    console.log(decoded.email);

    const user = await User.findOne({email: decoded.email });
    console.log("user in reset", user)
    if (!user) {
      return NextResponse.json(
        { status: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await hash(newPassword, saltRounds);
    user.password = hashedPassword;
    try {
      await user.save();
    } catch (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { status: false, message: 'Failed to update password' },
        { status: 500 }
      );
    }

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