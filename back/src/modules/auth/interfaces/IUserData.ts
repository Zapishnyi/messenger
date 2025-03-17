import { UserEntity } from '../../../database/entities/user.entity';

export interface IUserData {
  user: UserEntity;
  device: string;
}
