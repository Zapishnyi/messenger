import {
  Injectable,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EntityManager, In } from 'typeorm';

import { GlobalWSExceptionFilter } from '../../../common/filters/global-ws-exemption.filter';
import { JwtWSConnectGuard } from '../../../common/guards/jwt-ws-access-connect-guard';
import { AppConfigType } from '../../../configs/envConfigType';
import { FileEntity } from '../../../database/entities/file.entity';
import { MessageEntity } from '../../../database/entities/message.entity';
import { MessageEditReqDto } from '../../message/dto/req/message-edit.req.dto';
import { MessageService } from '../../message/services/message.service';
import { MessageEditDto } from '../dto/ws-message-edit.dto';
import { MessageDto } from '../dto/ws-message.dto';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
}) // Will use dynamic port from config
export class ChatGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly port: number;

  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, string>(); // socketId -> userId mapping
  private onlineUsersReversed = new Map<string, string>(); //  userId -> socketId mapping

  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    private readonly jwtWSConnectGuard: JwtWSConnectGuard,
    private readonly messageService: MessageService,
  ) {
    this.port = this.configService.get<AppConfigType>('app')!.port;
  }

  afterInit() {
    Logger.log(`WebSocket server initialized on port ${this.port}`);
  }

  private emitOnlineUsers() {
    const onlineUserIds = Array.from(this.onlineUsers.values());
    this.server.emit('online-users', onlineUserIds);
  }
  async handleConnection(client: Socket) {
    const user_id = await this.jwtWSConnectGuard.check(client);

    if (user_id) {
      this.onlineUsers.set(client.id, user_id);
      this.onlineUsersReversed.set(user_id, client.id);
      this.emitOnlineUsers();
    } else {
      client.emit('error', {
        message: 'status: 401 | messages:  Unauthorized',
      });
      process.nextTick(() => client.disconnect());
      return;
    }
    // Logger.log(`User ${user_id} connected (Socket: ${client.id})`);
  }

  async handleDisconnect(client: Socket) {
    const user_id = this.onlineUsers.get(client.id);
    if (user_id) {
      this.onlineUsers.delete(client.id);
      this.onlineUsersReversed.delete(user_id);
      this.emitOnlineUsers();
    }
    // Logger.log(`User ${user_id} disconnected (Socket: ${client.id})`);
  }

  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new WsException(errors),
    }),
  )
  @SubscribeMessage('send_message')
  @UseFilters(new GlobalWSExceptionFilter())
  async handleMessage(@MessageBody() message: MessageDto) {
    const message_id = await this.entityManager.transaction(
      async (em: EntityManager): Promise<string> => {
        const messageRepositoryEM = em.getRepository(MessageEntity);
        const fileRepositoryEM = em.getRepository(FileEntity);
        let files: FileEntity[] | null = null;
        if (message?.files?.length) {
          const fileIds = message.files.map((file) => file.file_id);
          files = await fileRepositoryEM.findBy({
            id: In(fileIds),
          });
        }
        const messageSaved = messageRepositoryEM.create({
          content: message.content,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          files: files ? files : [],
        });
        return (await messageRepositoryEM.save(messageSaved)).id;
      },
    );

    const receiverSocketId = this.onlineUsersReversed.get(message.receiver_id);
    const senderSocketId = this.onlineUsersReversed.get(message.sender_id);
    const messageWithId = { ...message, id: message_id };
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', messageWithId);
    }
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('receive_message', messageWithId);
    }
    return message;
  }

  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new WsException(errors),
    }),
  )
  @SubscribeMessage('delete_message')
  @UseFilters(new GlobalWSExceptionFilter())
  async handleDeleteMessage(@MessageBody() message: MessageEditDto) {
    await this.entityManager.transaction(
      async (em: EntityManager): Promise<void> => {
        const messageRepositoryEM = em.getRepository(MessageEntity);
        messageRepositoryEM.delete({ id: message.id });
      },
    );
    const receiverSocketId = this.onlineUsersReversed.get(message.receiver_id);
    const senderSocketId = this.onlineUsersReversed.get(message.sender_id);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('message_deleted', message);
    }
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('message_deleted', message);
    }

    return message;
  }

  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new WsException(errors),
    }),
  )
  @SubscribeMessage('edit_message')
  @UseFilters(new GlobalWSExceptionFilter())
  async handleEditMessage(@MessageBody() message: MessageEditReqDto) {
    const messageEdited = await this.messageService.editMessage(message);

    const receiverSocketId = this.onlineUsersReversed.get(
      messageEdited.receiver_id,
    );
    const senderSocketId = this.onlineUsersReversed.get(
      messageEdited.sender_id,
    );

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('message_edited', messageEdited);
    }
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('message_edited', messageEdited);
    }

    return message;
  }
}
