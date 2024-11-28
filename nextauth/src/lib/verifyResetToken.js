import jwt from 'jsonwebtoken';
import { getUserByEmail } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be stored securely

export async function verifyResetToken(token) {
  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user by email (assuming the token contains user email)
    const user = await getUserByEmail(decoded.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user; // Return the user if the token is valid
  } catch (error) {
    console.error('Token verification failed:', error);
    return null; // Return null if verification fails
  }
}
