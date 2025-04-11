import { FC } from 'react'

const OnLine: FC = () => {
  return (
    <>
      <div
        className={
          'absolute right-[-2px] bottom-0 h-[8px] w-[8px] rounded-full bg-[#90f997] z-[6] animate-fade-in'
        }
      ></div>
      <div
        className={`absolute right-[-2.5px] bottom-[-0.5px] h-[9px] w-[9px] rounded-full bg-[#000000] z-[5]
          animate-fade-in`}
      ></div>
    </>
  )
}

export default OnLine
