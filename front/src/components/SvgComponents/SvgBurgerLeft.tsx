import { SVGProps } from 'react'

export function SvgBurgerLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M8 5a1 1 0 0 0 0 2h12a1 1 0 1 0 0-2zm0 12a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2z"
        opacity=".5"
      ></path>
      <path
        fill="currentColor"
        d="M5.03 8.97a.75.75 0 0 1 0 1.06l-1.22 1.22H19a.75.75 0 0 1 0 1.5H3.81l1.22 1.22a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 0"
      ></path>
    </svg>
  )
}
