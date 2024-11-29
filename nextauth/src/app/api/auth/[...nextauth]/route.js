import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../model/user';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: "openid email profile"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          provider: 'google'
        };
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email"
        }
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          provider: 'github'
        };
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            throw new Error('No user found');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            provider: user.provider || 'credentials'
          };
        } catch (error) {
          throw new Error(error.message);
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle sign-in for OAuth providers (Google and GitHub)
      if (['google', 'github'].includes(account.provider)) {
        try {
          await dbConnect();
          
          // Check if this is the first user ever
          const userCount = await User.countDocuments();
          const isFirstUser = userCount === 0;
          
          let existingUser = await User.findOne({ email: user.email || profile.email });
          
          if (existingUser) {
            // Update provider if not already set
            if (!existingUser.provider) {
              existingUser.provider = account.provider;
              await existingUser.save();
            }
            return true;
          }

          console.log('account provider', account.provider)
          
          // Create new user, set as admin if first user
          const newUser = await User.create({
            name: user.name || profile.name,
            email: user.email || profile.email,
            role: isFirstUser ? 'admin' : 'user',
            provider: account.provider // Explicitly store the provider
          });
          console.log('newUser', newUser)
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = user.provider || account?.provider || 'credentials';
        
        // Fetch user from DB to ensure we have the most up-to-date information
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.provider = dbUser.provider || token.provider;
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role; // Add role to session
        session.user.provider = token.provider; // Add provider to session
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug messages
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };