import { useSearchParams } from "next/navigation";
import Button from "./Button";
import { VscGithubInverted } from "react-icons/vsc";
import { signIn } from 'next-auth/react'



export const GithubSignInButton = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  
    return (
      <Button
        className='w-full flex justify-center items-center gap-4'
        onClick={() => signIn('github', { 
          callbackUrl: callbackUrl 
        })}
        variant='outline'

      >
      <VscGithubInverted size={25} />

        Continue with GitHub
      </Button>
    )
  }
  
  export default GithubSignInButton;