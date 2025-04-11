function SvgChecked(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 3a9 9 0 1 0 9 9v-1h2v1c0 6.075-4.925 11-11 11S1 18.075 1 12S5.925 1 12 1c1.498 0 2.928.3 4.232.844l.923.385l-.77 1.846l-.923-.385A9 9 0 0 0 12 3m11.414 1.5L12 15.914L6.086 10L7.5 8.586l4.5 4.5l10-10z"
      ></path>
    </svg>
  )
}

export default SvgChecked
