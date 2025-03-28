import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
const HeaderAuth = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [isSignIn, setIsSignIn] = useState<boolean>(false)
  useEffect(() => {
    setIsSignIn(location.pathname === '/auth/sign-in')
  }, [location.pathname])
  return (
    <header
      className={'flex h-[10dvh] w-full cursor-pointer justify-end gap-[2vw] px-[3vw] py-[3vw]'}
    >
      <button
        onClick={() => {
          navigate('/auth/sign-up')
        }}
        className={`flex h-fit cursor-pointer items-center rounded-md border border-gray-300 p-[5px] px-[8px] shadow-lg
          ${!isSignIn ? 'shadow-[#8f638a]' : 'shadow-[#dadada]'} transition duration-[0.3s] hover:bg-gray-100`}
      >
        Sing up
      </button>
      <button
        onClick={() => {
          navigate('/auth/sign-in')
        }}
        className={`flex h-fit cursor-pointer items-center rounded-md border border-gray-300 p-[5px] px-[8px] shadow-lg
          ${isSignIn ? 'shadow-[#8f638a]' : 'shadow-[#dadada]'} transition duration-[0.3s] hover:bg-gray-100`}
      >
        Sing in
      </button>
    </header>
  )
}

export default HeaderAuth
