import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate reset token
export function generateResetToken(email) {
  const payload = { email };
  const options = { expiresIn: '1h' }; // Token expires in 1 hour
  const token = jwt.sign(payload, JWT_SECRET, options);
  
  return token;
}
