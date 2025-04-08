import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import BtnLoader from '../components/BtnLoader'
import ErrorsContainer from '../components/ErrorsContainer/ErrorsContainer'
import FormInput from '../components/FormInput'
import { InputFieldTypeEnum } from '../enums/InputFieldTtypeEnum'
import { errorHandle } from '../helpers/error-handle'
import IUserSignIn from '../interfaces/IUserSignIn'
import { UsersActions } from '../redux/Slices/usersSlice'
import { useAppDispatch } from '../redux/store'
import { storage } from '../services/localStorage.service'
import { api } from '../services/messenger.api.service'

const SignInForm = () => {
  const [errorMessage, setErrorMassage] = useState<string[] | null>(null)
  const { register, handleSubmit } = useForm<IUserSignIn>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [isPending, setIsPending] = useState(false)
  const SubmitHandler = async (credentials: IUserSignIn) => {
    setIsPending(true)
    try {
      const { tokens, user } = await api.auth.sign_in(credentials)
      storage.setAccessToken(tokens.access)
      storage.setRefreshToken(tokens.refresh)
      dispatch(UsersActions.setLoggedUser(user))
      navigate('/contacts')
    } catch (e) {
      setErrorMassage(errorHandle(e).message)
    } finally {
      setIsPending(false)
    }
  }
  return (
    <form
      className={
        'relative box-border animate-fade-in flex flex-col items-center gap-[20px] rounded-[10px] '
      }
      onSubmit={handleSubmit(SubmitHandler)}
    >
      <p className={'text-2xl font-bold text-[#313b54]'}>Sign In</p>
      <FormInput<IUserSignIn>
        register={register}
        field_name={'email'}
        field_type={InputFieldTypeEnum.TEXT}
        field_label={'Email'}
      />
      <FormInput<IUserSignIn>
        register={register}
        field_name={'password'}
        field_label={'Password'}
        field_type={InputFieldTypeEnum.PASSWORD}
      />
      <div className={'flex w-full items-center justify-center gap-2'}>
        <button
          type="button"
          className={`flex w-full cursor-pointer shadow-md items-center animate-fade-in justify-center rounded-md border
            border-gray-300 bg-[#87a1e3] p-2 duration-300 hover:bg-[#9cabd2]
            hover:shadow-[0_5px_10px_2px_rgba(99,102,241,0.7)] hover:transition`}
          onClick={() => navigate('/auth/sign-up')}
        >
          Sign-up
        </button>
        <button
          className={`relative flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300
            bg-[#87a1e3] p-2 shadow-md duration-300 hover:bg-[#9cabd2]
            hover:shadow-[0_5px_10px_2px_rgba(99,102,241,0.7)] hover:transition`}
        >
          Login
          {isPending && <BtnLoader loadingState={isPending} />}
        </button>
      </div>

      {errorMessage?.length && <ErrorsContainer errors={errorMessage} />}
    </form>
  )
}

export default SignInForm
