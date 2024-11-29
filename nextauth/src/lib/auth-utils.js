import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export async function canChangePassword() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return false;
  }

  // Check if the user was registered through email/credentials provider
  return session.user.provider === 'credentials';
}

export function isOAuthProvider(provider) {
  const oauthProviders = ['google', 'github'];
  return oauthProviders.includes(provider);
}