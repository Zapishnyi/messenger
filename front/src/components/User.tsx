import { FC, memo } from 'react'

import OnLine from './OnLine'
import SvgUserAvatar from './SvgComponents/SvgAvatar'
import SvgChecked from './SvgComponents/SvgChecked'

interface IProps {
  nick_name: string
  online: boolean
  action?: () => void
  isInContacts?: boolean
}

const User: FC<IProps> = memo(({ online, nick_name, isInContacts, action }) => {
  // console.log('.')
  return (
    <div className="flex grow-1 items-start gap-[10px]" onClick={action}>
      <div className="relative">
        <SvgUserAvatar className="w-[22px]" />
        {online && <OnLine />}
        {isInContacts && (
          <SvgChecked
            className={
              'absolute right-[-4px] top-[-1px] h-[12px] w-[12px] rounded-full bg-[#ffffff] z-[5] '
            }
          />
        )}
      </div>
      <p>{nick_name}</p>
    </div>
  )
})

export default User
