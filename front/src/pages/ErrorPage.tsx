import { FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import ErrorsContainer from '../components/ErrorsContainer/ErrorsContainer'

const ErrorPage: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const errors = location.state

  const clickHandle = () => {
    navigate('/chat')
  }
  return (
    <div className={'relative flex h-[100dvh] w-[100vw] flex-col items-center justify-center'}>
      <div className={'relative flex flex-col items-center justify-center gap-4'}>
        <h1>Ups, something went wrong!</h1>
        <div
          onClick={clickHandle}
          className={
            'w-fit cursor-pointer rounded-md border border-gray-300 p-[5px] shadow-md hover:bg-gray-100'
          }
        >
          <p>Return to main page</p>
        </div>
        {errors?.length && <ErrorsContainer errors={errors} />}
      </div>
    </div>
  )
}

export default ErrorPage
