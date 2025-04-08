import { joiResolver } from '@hookform/resolvers/joi'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import ErrorsContainer from '../components/ErrorsContainer/ErrorsContainer'
import FormInput from '../components/FormInput'
import { InputFieldTypeEnum } from '../enums/InputFieldTtypeEnum'
import { errorHandle } from '../helpers/error-handle'
import IUserSignUp from '../interfaces/IUserSignUp'
import { storage } from '../services/localStorage.service'
import { api } from '../services/messenger.api.service'
import userSingUpValidator from '../validators/user-sign-up.validator'

const SingUpForm: FC = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserSignUp>({
    mode: 'onSubmit',
    resolver: joiResolver(userSingUpValidator),
    defaultValues: {
      email: '',
      password: '',
      nick_name: '',
    },
  })
  const [errorMessage, setErrorMassage] = useState<string[] | null>(null)
  const formSubmit = async (formData: IUserSignUp) => {
    try {
      await api.auth.sign_up(formData)
      navigate('/auth/sign-in')
    } catch (e) {
      setErrorMassage(errorHandle(e).message)
    } finally {
      storage.deleteTokens()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(formSubmit)}
      className={
        'relative box-border animate-fade-in flex flex-col items-center gap-[20px] rounded-[10px] '
      }
    >
      <p className={'text-2xl font-bold text-[#313b54]'}>Sign Up</p>
      <FormInput<IUserSignUp>
        register={register}
        field_name={'nick_name'}
        field_label={'Nick name'}
        field_type={InputFieldTypeEnum.TEXT}
        error={errors.nick_name?.message}
      />

      <FormInput<IUserSignUp>
        register={register}
        field_name={'email'}
        field_label={'Email'}
        field_type={InputFieldTypeEnum.TEXT}
        error={errors.email?.message}
      />

      <FormInput<IUserSignUp>
        register={register}
        field_name={'password'}
        field_label={'Password'}
        field_type={InputFieldTypeEnum.PASSWORD}
        error={errors.password?.message}
      />
      <div className={'flex w-full items-center justify-center gap-2'}>
        <button
          type="button"
          className={`flex w-full cursor-pointer shadow-md items-center animate-fade-in justify-center rounded-md border
            border-gray-300 bg-[#87a1e3] py-2 duration-300 hover:bg-[#9cabd2]
            hover:shadow-[0_5px_10px_2px_rgba(99,102,241,0.7)] hover:transition`}
          onClick={() => navigate('/auth/sign-in')}
        >
          Sign-in
        </button>
        <button
          className={`flex w-full cursor-pointer shadow-md items-center animate-fade-in justify-center rounded-md border
            border-gray-300 bg-[#87a1e3] py-2 duration-300 hover:bg-[#9cabd2]
            hover:shadow-[0_5px_10px_2px_rgba(99,102,241,0.7)] hover:transition`}
        >
          Submit
        </button>
      </div>

      {errorMessage?.length && <ErrorsContainer errors={errorMessage} />}
    </form>
  )
}

export default SingUpForm
