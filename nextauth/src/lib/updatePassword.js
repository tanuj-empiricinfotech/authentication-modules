import bcrypt from 'bcryptjs';
import { updateUserPassword } from './db';

export async function updatePassword(email, newPassword) {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds

    // Update the user's password in the database
    const success = await updateUserPassword(email, hashedPassword);

    if (!success) {
      throw new Error('Failed to update password');
    }

    return true; // Return true if the password was successfully updated
  } catch (error) {
    console.error('Error updating password:', error);
    return false; // Return false if updating the password fails
  }
}
