import { FC } from 'react'

const SvgDelete: FC = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={
        'w-[22px] transform cursor-pointer transition-all duration-[0.3s] ease-in-out hover:scale-[1.2]'
      }
    >
      <path
        fill="currentColor"
        d="M16 9H8v10h8zm-.47 7.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14l-2.13-2.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14z"
        opacity=".3"
      ></path>
      <path
        fill="currentColor"
        d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8z"
      ></path>
    </svg>
  )
}
export default SvgDelete
