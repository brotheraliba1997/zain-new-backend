import { Injectable } from '@nestjs/common';
import {
  GetNotificationDto,
  NotificationPaginator,
} from './dto/get-notifications.dto';
import { paginate } from 'src/common/pagination/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { FCMService } from './fcm.service';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    // private readonly oneSignalService: OneSignalService,
    private readonly fcmService: FCMService,
    // private readonly webSocketServices: WebsocketGateway,
  ) {}

  async create(notificationData): Promise<any> {
    const notificationCreated = await this.prisma.notification.create({
      data: {
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data ?? {},
        recipients: {
          create: notificationData.recipients?.map((item: any) => ({
            userId: item,
          })),
        },
      },
    });

    const { recipients } = notificationData;
    console.log(recipients, 'recipientsrecipients');

    // await this.oneSignalService.sendNotification(
    //   recipients,
    //   notificationCreated,
    // );
    //  await this.webSocketServices.sendNotification(recipients, notificationData);

    await this.fcmService.sendNotification(recipients, notificationCreated);

    return notificationCreated;
  }

  async sendToAllUsersExceptSuperAdmin(notificationData): Promise<any> {
    // const users = this.userService.getAllUserIdsExceptSuperAdmin();

    const users = await this.prisma.user.findMany({
      where: { role: { not: 'super_admin' } },
      select: {
        id: true,
      },
    });

    const notificationCreated = await this.prisma.notification.create({
      data: {
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data ?? {},
        recipients: {
          create: users.map((user: any) => ({
            userId: user.id,
          })),
        },
      },
    });

    const { recipients } = notificationData;
    console.log(recipients, 'recipientsrecipients');

    // await this.oneSignalService.sendNotification(
    //   recipients,
    //   notificationCreated,
    // );

    await this.fcmService.sendNotification(recipients, notificationCreated);

    //  await this.webSocketServices.sendNotification(recipients, notificationData);
    return notificationCreated;
  }

  // async update(
  //   id: string,
  //   request: UpdateNotificationDto,
  //   response,
  // ): Promise<any> {
  //   // const { name, description } = request;

  //   try {
  //     const existingRecord = await this.prisma.notification.findFirst({
  //       where: {
  //         id: { not: id },
  //         // OR: [{ name: name }],
  //       },
  //     });
  //     if (existingRecord) {
  //       return response.status(409).send({
  //         status: 'error',
  //         message: `Validation failed: ${existingRecord} already exists`,
  //       });
  //     }

  //     const Notification = await this.prisma.notification.update({
  //       where: { id },
  //       data: {
  //         // name,
  //         // description,
  //       },
  //     });

  //     return response.status(200).send({
  //       status: 'success',
  //       message: 'Notification updated successfully',
  //       data: Notification,
  //     });
  //   } catch (error) {
  //     return response.status(422).send({
  //       status: 'error',
  //       message: 'Something went wrong while creating account',
  //       meta: error.message,
  //     });
  //   }
  // }

  // async updateStatus(
  //   id: string,
  //   request: UpdateNotificationDto,
  //   response,
  // ): Promise<any> {
  //   const {} = request;

  //   try {
  //     const notification = await this.prisma.notification.update({
  //       where: { id },
  //       data: {
  //         // account_status: account_status,
  //       },
  //     });
  //     return response.status(200).send({
  //       status: 'success',
  //       message: 'Notification status updated successfully',
  //       // token: token,
  //       // role: role.name,
  //     });
  //   } catch (error) {
  //     return response.status(422).send({
  //       status: 'error',
  //       message: 'Something went wrong while updating account',
  //       meta: error.message,
  //     });
  //   }
  // }

  async getNotificationById(id: string, response): Promise<any> {
    try {
      const notificationFound = await this.prisma.notification.findUnique({
        where: { id },
      });

      if (!notificationFound) {
        return response.status(404).send({
          status: 'error',
          message: `Notification with ID ${id} not found.`,
        });
      }

      // Success response
      return response.status(200).send({
        status: 'success',
        message: `Notification with ID ${id} found successfully.`,
        data: notificationFound,
      });
    } catch (error) {
      // Error response
      return response.status(500).send({
        status: 'error',
        message:
          error.message ||
          'An unexpected error occurred while fetching the Notification.',
      });
    }
  }

  async getNotification({
    limit = 30,
    page = 1,
    search,
  }: GetNotificationDto): Promise<NotificationPaginator> {
    const parsedLimit = Number(limit) || 30;
    const parsedPage = Number(page) || 1;

    const skip = (parsedPage - 1) * parsedLimit;

    const where: any = {};

    if (search && search.trim()) {
      where.OR = [{ name: { contains: search } }];
    }

    const [results, totalCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: parsedLimit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    const url = `/notifications?limit=${parsedLimit}&page=${parsedPage}`;

    return {
      data: results,
      ...paginate(totalCount, parsedPage, parsedLimit, results.length, url),
    };
  }

  // async remove(id: string, response) {
  //   try {
  //     const user = await this.prisma.notification.findUnique({
  //       where: { id },
  //     });

  //     if (!user) {
  //       throw new BadRequestException('User not found.');
  //     }

  //     await this.prisma.notification.delete({
  //       where: { id },
  //     });

  //     return response.status(200).send({
  //       status: 'success',
  //       message: `Deleted Notification with ID ${id}.`,
  //     });
  //   } catch (error) {
  //     return response.status(500).send({
  //       status: 'error',
  //       message:
  //         error.message ||
  //         'An unexpected error occurred while deleting the Notification.',
  //     });
  //   }
  // }
}
