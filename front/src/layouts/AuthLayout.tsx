import { FC, useLayoutEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { setNavigate } from '../helpers/navigate-to'
import { storage } from '../services/localStorage.service'

const AuthLayout: FC = () => {
  // console.log('.')
  const navigate = useNavigate()
  setNavigate(navigate)

  const location = useLocation()

  const [isSignIn, setIsSignIn] = useState<boolean>(false)

  useLayoutEffect(() => {
    setIsSignIn(location.pathname === '/auth/sign-in')
  }, [location.pathname])

  useLayoutEffect(() => {
    const accessExist = !!storage.getAccessToken()
    const refreshExist = !!storage.getRefreshToken()
    if (accessExist && refreshExist) {
      navigate('/contacts')
    }
  }, [])

  return (
    <div>
      {/* <HeaderAuth /> */}
      <div className={'flex h-[80dvh] w-full items-center justify-center'}>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
