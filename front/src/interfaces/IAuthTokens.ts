import IAuthTokensPair from './IAuthTokensPair'
import IUser from './IUser'

export default interface IAuthTokens {
  tokens: IAuthTokensPair
  user: IUser
}
