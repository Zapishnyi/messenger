import { SVGProps } from 'react'

export function SvgBurgerRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M3 6a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m0 12a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1"
        opacity=".5"
      ></path>
      <path
        fill="currentColor"
        d="M18.97 8.97a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l1.22-1.22H5a.75.75 0 0 1 0-1.5h15.19l-1.22-1.22a.75.75 0 0 1 0-1.06"
      ></path>
    </svg>
  )
}
