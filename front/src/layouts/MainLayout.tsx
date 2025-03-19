import { FC } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import HeaderMain from '../components/HeaderMain'
import { setNavigate } from '../helpers/navigate-to'

const MainLayout: FC = () => {
  const navigate = useNavigate()
  setNavigate(navigate)

  return (
    <div
      className={
        'relative flex h-[100dvh] w-[100vw] flex-col items-center justify-start overflow-hidden'
      }
    >
      <HeaderMain />
      <Outlet />
    </div>
  )
}

export default MainLayout
