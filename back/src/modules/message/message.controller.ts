import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  StreamableFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { FileLimitation } from '../../common/custom_decorators/file-limitation.decorator';
// eslint-disable-next-line max-len
import { GetStoredUserDataFromResponse } from '../../common/custom_decorators/get-stored-user-data-from-response.decorator';
import { FileOwnershipGuard } from '../../common/guards/file-ownership.guard';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { MessageOwnershipGuard } from '../../common/guards/message-ownership.guard';
import { IUserData } from '../auth/interfaces/IUserData';
import { MessageEditReqDto } from './dto/req/message-edit.req.dto';
import { FilesResDto } from './dto/res/files.res.dto';
import { MessageResDto } from './dto/res/message.res.dto';
import { FileService } from './services/file.service';
import { FilesOutputPresenterService } from './services/files-output-presenter.service';
import { MessagePresenterService } from './services/message-presenter.service';
import { MessageService } from './services/message.service';

@ApiTags('3.Massages')
@Controller('/message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messagePresenter: MessagePresenterService,
    private readonly fileService: FileService,
    private readonly filesOutputPresenterService: FilesOutputPresenterService,
  ) {}

  // Get logged user data -----------------------------------------------------
  @ApiOperation({
    summary: "Receive logged user's entire conversation by interlocutor ID.",
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'jwt expired',
      timestamp: '2024-12-03T18:52:08.622Z',
      path: '/message/:id',
    },
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('Access-Token')
  @Get(':id')
  public async getMessages(
    @GetStoredUserDataFromResponse() { user }: IUserData,
    @Param('id', ParseUUIDPipe) opponent_id: string,
  ): Promise<MessageResDto[]> {
    return (await this.messageService.getMessages(user.id, opponent_id)).map(
      (e) => this.messagePresenter.toResponseDtoFromEntity(e),
    );
  }
  // Edit message ----------------------------------------------
  @ApiOperation({
    summary: "Edit logged user's message by message ID.",
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'jwt expired',
      timestamp: '2024-12-03T18:52:08.622Z',
      path: '/message/:id',
    },
  })
  @UseGuards(JwtAccessGuard, MessageOwnershipGuard)
  @ApiBearerAuth('Access-Token')
  @Patch(':id')
  public async editMessage(
    @Param('id', ParseUUIDPipe) message_id: string,
    @Body() dto: MessageEditReqDto,
  ): Promise<MessageResDto> {
    return this.messagePresenter.toResponseDtoFromEntity(
      await this.messageService.editMessage(message_id, dto),
    );
  }

  @ApiOperation({
    summary: "Delete logged user's message by message ID .",
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'jwt expired',
      timestamp: '2024-12-03T18:52:08.622Z',
      path: '/message/:id',
    },
  })
  @UseGuards(JwtAccessGuard, MessageOwnershipGuard)
  @ApiBearerAuth('Access-Token')
  @Delete(':id')
  public async deleteMessage(
    @Param('id', ParseUUIDPipe) message_id: string,
  ): Promise<void> {
    await this.messageService.deleteMessage(message_id);
  }

  // Upload the files and store it in PostgreSQL
  @ApiOperation({
    summary: 'Upload file to DB',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'jwt expired',
      timestamp: '2024-12-03T18:52:08.622Z',
      path: '/message/file/upload',
    },
  })
  @ApiPayloadTooLargeResponse({
    description: 'Filesize is more than 1MB',
    example: {
      statusCode: 413,
      messages: 'File too large',
      timestamp: '2024-10-09T17:21:35.763Z',
      path: '/message/file/upload',
    },
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('Access-Token')
  @FileLimitation('file', 1024 * 1000)
  @ApiConsumes('multipart/form-data')
  // @ApiFile('file', true, false, '1MB')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @Post('files/upload')
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<FilesResDto> {
    const uploadedFiles = await this.fileService.uploadFile(files);
    return {
      files: uploadedFiles.map((e) =>
        this.filesOutputPresenterService.toResponseDtoFromEntity(e),
      ),
    };
  }

  // Serve the file by its ID
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'jwt expired',
      timestamp: '2024-12-03T18:52:08.622Z',
      path: '/message/file/:id',
    },
  })
  @ApiOperation({
    summary: "Download logged user's or interlocutor's file by file ID.",
  })
  @UseGuards(JwtAccessGuard, FileOwnershipGuard)
  @ApiBearerAuth('Access-Token')
  @Get('file/:id')
  async downloadFile(@Param('id', ParseUUIDPipe) file_id: string) {
    const file = await this.fileService.getFile(file_id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return new StreamableFile(file.filedata, {
      type: file.mimetype,
    });
  }
}
