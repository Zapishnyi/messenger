import { FC } from 'react'

import SignInForm from '../forms/SignInForm'

const SignIn: FC = () => {
  return (
    <div className={'flex h-[80dvh] w-full items-center justify-center'}>
      <SignInForm />
    </div>
  )
}

export default SignIn
