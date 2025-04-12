import IContact from './IContact'

export default interface IUser {
  id: string
  nick_name: string
  email: string
  last_visit: string | null
  contacts?: IContact[]
  created: string
  updated: string
}
