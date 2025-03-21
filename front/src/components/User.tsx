import { FC } from 'react'

import { SvgUserAvatar } from './SvgAvatar'

interface IProps {
  nick_name: string
  online: boolean
}

const User: FC<IProps> = ({ online, nick_name }) => {
  return (
    <div className="flex items-start gap-[10px]">
      <div className="relative">
        <SvgUserAvatar />
        {online && (
          <>
            <div
              className={
                'absolute right-[-2px] bottom-0 h-[10px] w-[10px] rounded-full bg-[#90f997] z-[6]'
              }
            ></div>
            <div
              className={
                'absolute right-[-3px] bottom-[-1px] h-[12px] w-[12px] rounded-full bg-[#000000] z-[5] '
              }
            ></div>
          </>
        )}
      </div>
      <p>{nick_name}</p>
    </div>
  )
}

export default User
