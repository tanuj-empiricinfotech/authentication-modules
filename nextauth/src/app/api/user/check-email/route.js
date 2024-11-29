import { NextResponse } from 'next/server';
import User from '../../../../model/user';
import dbConnect from '../../../../lib/mongodb';


export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email }).select('email');
    const exists = !!user;

    return NextResponse.json({ success: true, exists });
  } catch (error) {
    console.error('Error checking email existence:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
