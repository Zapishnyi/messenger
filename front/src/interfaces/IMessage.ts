import IFile from './IFile'

export default interface IMessage {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  files: IFile[]
  created: string
  updated?: string
}
