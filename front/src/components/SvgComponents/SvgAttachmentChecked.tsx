import { SVGProps } from 'react'

export function SvgAttachmentCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M16.61 13.5c-.8.35-1.5.86-2.07 1.5H9.5a2.5 2.5 0 0 1 0-5H17v1.5H9.5c-.55 0-1 .45-1 1s.45 1 1 1zm-13.11-1c0-2.21 1.79-4 4-4H18a2.495 2.495 0 0 1 1.45 4.53c.6.04 1.18.17 1.72.38c.52-.67.83-1.5.83-2.41c0-2.21-1.79-4-4-4H7.5C4.46 7 2 9.46 2 12.5S4.46 18 7.5 18h5.59c.09-.53.25-1.03.46-1.5H7.5c-2.21 0-4-1.79-4-4m17.84 3.34l-3.59 3.59l-1.59-1.59L15 19l2.75 3l4.75-4.75z"
      ></path>
    </svg>
  )
}
