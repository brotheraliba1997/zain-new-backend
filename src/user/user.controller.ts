import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Res,
  BadRequestException,
  UploadedFile,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';

import { NotificationService } from './../notification/notification.service';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { CurrentUser } from 'src/decorators/current-user.decorators';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
// import { Roles } from 'src/decorators/roles.decorators';



@ApiTags('Users')
@Controller('users')
// @UseGuards(JwtAuthUsersGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly usersService: UserService,

    private readonly notificationService: NotificationService,
  ) {}

  @Get('me')
  getMyProfile(@CurrentUser() user: any, @Res() response: Response) {
    const userId = user.id;
    return this.usersService.getUserById(userId, response);
  }

  @Put('me')
  // @ApiBearerAuth()
  updateMyProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
    @Res() response: Response,
  ) {
    const userId = user.id;
    return this.usersService.update(userId, updateProfileDto, response);
  }

  // @Post()
  // async createUser(
  //   @CurrentUser() user: any,
  //   @Body() createUserDto: CreateUserDto,
  // ) {
  //   if (!user.id) {
  //     throw new BadRequestException('User creation failed.');
  //   }

  //   if (user.role === 'admin' && !createUserDto.companyId) {
  //     throw new BadRequestException('admin need company id ');
  //   }

  //   if (user.role !== 'super_admin' && user.companyId) {
  //     createUserDto.companyId = user.companyId;
  //   }

  //   const Createduser: any = await this.usersService.create(createUserDto);

  //   if (
  //     user.role === 'admin' &&
  //     Createduser.role === 'client' &&
  //     createUserDto.doctorId
  //   ) {
  //     const data = {
  //       participants: [Createduser.id, createUserDto.doctorId],
  //       isGroup: false,
  //       name: 'Personal Chat',
  //     };

  //     console.log(user.id, createUserDto.doctorId, 'user');

  //     await this.chatService.create(data);

  //     const notificationData = {
  //       type: 'REGISTRATION',
  //       title: ' Assigned',
  //       message: `Dr. ${user.name} has been assigned to your appointment.`,

  //       recipients: [Createduser.id, createUserDto.doctorId],
  //     };

  //     await this.notificationService.create(notificationData);
  //   }

  //   return {
  //     status: 'success',
  //     message: 'User created successfully',
  //   };
  // }

  @Get()
  getAllUsers(@Query() query: GetUsersDto, @CurrentUser() user: any) {
    // console.log('user=>', user);
    if (user.role == 'admin') {
      query.companyId = user.companyId;
    }
    return this.usersService.getUsers(query);
  }

  // @Get()
  // @UseGuards(JwtAuthUsersGuard)
  // getAllUsers(@Query() query: GetUsersDto) {
  //   return this.usersService.getUsers(query);
  // }

  @Get(':id')
  getUser(@Param('id') id: string, @Res() response: Response) {
    return this.usersService.getUserById(id, response);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    return this.usersService.update(id, updateUserDto, response);
  }

  @Put('status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    return this.usersService.updateStatus(id, updateUserDto, response);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('upload-profile')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @Res() response: Response,
  ): Promise<any> {
    const userId = user?.id;
    return this.usersService.uploadProfilePicture(file, userId, response);
  }

  // @Get(':id/devices')
  // @Roles('client')
  // async getDeviceReadings(
  //   @Param('id', ParseObjectIdPipe) id: string,
  //   @CurrentUser() user: any,
  // ) {
  //   const clientId = user.id;
  //   if (clientId === id) {
  //     const deviceReadings =
  //       await this.deviceReadingService.getClientDeviceReadings({
  //         clientId,
  //       });

  //     console.log(deviceReadings, 'deviceReadings');

  //     return {
  //       status: 'success',
  //       message: 'Device readings fetched successfully',
  //       data:  deviceReadings ,
  //     };
  //   }
  // }
}
