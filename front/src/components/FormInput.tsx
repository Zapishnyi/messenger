import { useState } from 'react'
import { FieldValues, Path, UseFormRegister } from 'react-hook-form'

import { InputFieldTypeEnum } from '../enums/InputFieldTtypeEnum'
import SvgEyeClosed from './SvgComponents/SvgEyeClosed'
import SvgEyeOpen from './SvgComponents/SvgEyeOpen'

interface IProps<T extends FieldValues> {
  register: UseFormRegister<T>
  field_name: Path<T>
  field_label: string
  field_type: InputFieldTypeEnum
  error?: string
  required?: boolean
  placeholder?: string
}

const FormInput = <T extends FieldValues>({
  register,
  field_name,
  field_type,
  field_label,
  required,
  error,
  placeholder,
}: IProps<T>) => {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(
    field_type !== InputFieldTypeEnum.PASSWORD,
  )
  const type =
    field_type === InputFieldTypeEnum.PASSWORD
      ? passwordVisibility
        ? InputFieldTypeEnum.TEXT
        : InputFieldTypeEnum.PASSWORD
      : field_type
  const eRestrictHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') &&
      type === InputFieldTypeEnum.NUMBER
    ) {
      e.preventDefault()
    }
  }
  return (
    <label className={'select-non relative flex flex-col text-left'}>
      {field_label}:{' '}
      <input
        className={
          'w-[400px] rounded-md border border-gray-200/20 bg-[#ecf2fe] p-[5px] px-[10px] text-lg'
        }
        onKeyDown={eRestrictHandle}
        type={type}
        autoComplete="on"
        placeholder={placeholder}
        {...register(field_name, {
          required: required || true,
        })}
      />
      {!!error && (
        <p
          className={
            ":before:content-['*'] absolute right-0 bottom-[37px] w-4/5 text-right text-red-600"
          }
        >
          {error}
        </p>
      )}
      {field_type === InputFieldTypeEnum.PASSWORD && (
        <div
          className={'absolute top-[30px] right-[5px] cursor-pointer'}
          onClick={() => setPasswordVisibility((current) => !current)}
        >
          {passwordVisibility ? <SvgEyeClosed /> : <SvgEyeOpen />}
        </div>
      )}
    </label>
  )
}

export default FormInput
