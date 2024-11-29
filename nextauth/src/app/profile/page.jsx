
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Profile from './component/Profile'

const Page = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin?callbackUrl=/profile')
  }

  const { user } = session;

  console.log('user', user)

  return (
    <Profile 
      initialUser={{
        name: user?.name,
        email: user?.email,
        image: user?.image,
        id: user?.id,
        provider : user?.provider,
        createdAt: user?.createdAt || new Date().toISOString()
      }} 
    />
  );
}

export default Page;