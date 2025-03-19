import { FC } from 'react'

import ErrorItem from './ErrorItem'

interface IProps {
  errors: string[] | string
}

const ErrorsContainer: FC<IProps> = ({ errors }) => {
  return (
    <div
      className={`w-fit-content text-red absolute bottom-[-10px] left-1/2 z-101 flex -translate-x-1/2 translate-y-full
        gap-[30px] rounded-[10px] border border-gray-200/20 bg-white p-[20px] whitespace-nowrap select-none`}
    >
      <div>
        <p>Errors list:</p>
      </div>
      <ul className={'flex flex-col text-red-500'}>
        {Array.isArray(errors) ? (
          errors.map((e, i) => <ErrorItem key={i} errorMessage={e} />)
        ) : (
          <ErrorItem errorMessage={errors} />
        )}
      </ul>
    </div>
  )
}

export default ErrorsContainer
