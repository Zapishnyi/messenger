import { FC, memo } from 'react'

import SvgUserAvatar from './SvgComponents/SvgAvatar'
import SvgChecked from './SvgComponents/SvgChecked'

interface IProps {
  nick_name: string
  online: boolean
  action?: () => void
  isInContacts?: boolean
}

const User: FC<IProps> = memo(({ online, nick_name, isInContacts, action }) => {
  console.log('.')
  return (
    <div className="flex grow-1 items-start gap-[10px]" onClick={action}>
      <div className="relative">
        <SvgUserAvatar />
        {online && (
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
        )}
        {isInContacts && (
          <div
            className={
              'absolute right-[-4px] top-[-1px] h-[12px] w-[12px] rounded-full bg-[#ffffff] z-[5] '
            }
          >
            <SvgChecked />
          </div>
        )}
      </div>
      <p>{nick_name}</p>
    </div>
  )
})

export default User
