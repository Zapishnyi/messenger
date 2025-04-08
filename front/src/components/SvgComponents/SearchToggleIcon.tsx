import { useState } from 'react'

const SearchToggle = () => {
  const [isCross, setIsCross] = useState(false)

  const magnifier = 'M12 12 A8 8 0 1 1 11.9 12 M17 17 L26 26' // magnifying glass
  const cross = 'M10 10 L30 30 M30 10 L10 30' // cross (X)

  return (
    <svg
      onClick={() => setIsCross((prev) => !prev)}
      viewBox="0 0 40 40"
      className="w-10 h-10 stroke-indigo-600 cursor-pointer transition-all duration-300 ease-in-out"
      fill="none"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <path d={isCross ? cross : magnifier} className="transition-all duration-300 ease-in-out" />
    </svg>
  )
}

export default SearchToggle
