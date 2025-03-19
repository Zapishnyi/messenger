import { FC } from 'react'

interface IProps {
  errorMessage: string
}

const ErrorItem: FC<IProps> = ({ errorMessage }) => {
  return (
    <li>
      <p>{errorMessage}</p>
    </li>
  )
}

export default ErrorItem
