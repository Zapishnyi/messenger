import IFile from '../../interfaces/IFile';

export class MessageResDto {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created: Date;
  updated: Date;
  files?: IFile[];
}
