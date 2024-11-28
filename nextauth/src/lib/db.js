// Assuming you're using MongoDB with Mongoose

import User from "../model/user";

// Function to get user by email
export async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

// Function to update user password
export async function updateUserPassword(email, newPassword) {
  try {
    const result = await User.updateOne({ email }, { password: newPassword });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
}
