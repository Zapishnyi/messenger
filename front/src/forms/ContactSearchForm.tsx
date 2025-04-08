import { FC, KeyboardEvent, memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'

import SvgCross from '../components/SvgComponents/SvgCross'
import SvgMagnifyingGlassBtn from '../components/SvgComponents/SvgMagnifyingGlassBtn'
import { SearchActions } from '../redux/Slices/searchSlice'
import { UsersActions } from '../redux/Slices/usersSlice'
import { useAppDispatch, useAppSelector } from '../redux/store'

const ContactSearchForm: FC = memo(() => {
  const { register, watch } = useForm({ mode: 'all', defaultValues: { search: '' } })
  const search = watch('search')
  const [debounceSearch] = useDebounce(search, 300)
  const { query } = useAppSelector((state) => state.search)
  const { isUsersOnFocus } = useAppSelector((state) => state.helpers)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [isInputOnFocus, setInputOnFocus] = useState<boolean>(false)
  useEffect(() => {
    dispatch(UsersActions.getUsersByQuery({ ...query, search: debounceSearch }))
    dispatch(SearchActions.setQuery({ ...query, search: debounceSearch }))
    if (!location.pathname.includes('/users') && isInputOnFocus) {
      navigate('/users')
    }
    console.log('isUsersOnFocus', isUsersOnFocus)
    // if (!isInputOnFocus || !isUsersOnFocus) {
    //   console.log('contacts')
    //   navigate('/contacts')
    // }
  }, [debounceSearch, isInputOnFocus])

  const searchHandle = () => {}

  const toContacts = () => {
    if (location.pathname.includes('/users')) {
      navigate('/contacts')
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLFormElement>) => {
    setInputOnFocus(e.type === 'focus')
  }
  return (
    <form
      onFocusCapture={handleFocus}
      onBlur={handleFocus}
      onKeyDown={handleKeyDown}
      className={'w-full h-full relative p-[5px]'}
    >
      <input
        type="text"
        {...register('search')}
        className={'w-full h-full border-1 px-[10px] rounded-2xl bg-[#ffffff] border-[#959595] '}
      />
      <div
        className={`absolute top-1/2 right-[12px] w-[20px] -translate-y-1/2 ${ location.pathname.includes('/users') &&
          'cursor-pointer hover:scale-110 transition duration-[0.3s]' } `}
        onClick={toContacts}
      >
        {location.pathname.includes('/users') ? (
          <div className={'animate-fade-in'}>
            <SvgCross />
          </div>
        ) : (
          <div className={'animate-fade-in'}>
            <SvgMagnifyingGlassBtn />
          </div>
        )}
      </div>
    </form>
  )
})

export default ContactSearchForm
