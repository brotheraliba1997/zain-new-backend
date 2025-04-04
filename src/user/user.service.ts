import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto, UserPaginator } from './dto/get-users.dto';
import { paginate } from 'src/common/pagination/paginate';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
// import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // create(createUserDto: CreateUserDto) {
  //   // prisma.users
  //   return this.users[0];
  // }

  async create(request: CreateUserDto) {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      address = '',
      city = '',
      state = '',
      zipCode = '',
      companyId,
      programs,
      doctorId,
    } = request;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    console.log('data=>', request, request.companyId);

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const userData: any = {
      firstName,
      lastName,
      email: email,
      phone: phone,
      password: hash,
      role: role,
      address,
      city,
      state,
      zipCode,
      doctorId,
    };

    if (companyId) {
      userData.companyId = companyId;
      if (role == 'admin') {
        const adminFound = await this.prisma.user.findFirst({
         
        });

        if (adminFound) {
          return new ConflictException('Company admin already exists');
        }
      }
    }

    if (role == 'client' && programs?.length > 0) {
      userData.programs = {
        create: programs?.map((programId) => ({
          program: { connect: { id: programId } },
        })),
      };
    }

    // try {
    const lastUser = await this.prisma.user.findFirst({
      orderBy: {
        createdAt: 'desc', // Ensure you're ordering by creation date or any unique identifier
      },
    });
   
    
  

  
   

    const userCreated = await this.prisma.user.create({
      data: userData,
    });

    return userCreated;
    // return response.status(200).send({
    //   status: 'success',
    //   message: 'User created successfully',
    // });
    // } catch (error) {
    //   console.log('err=>', error);
    //   if (error?.meta?.target == 'User_email_key') {
    //     return response.status(422).send({
    //       status: 'error',
    //       message: 'Account already exists with this email',
    //     });
    //   } else if (error?.meta?.target == 'User_phone_key') {
    //     return response.status(422).send({
    //       status: 'error',
    //       message: 'Account already exists with this phone',
    //     });
    //   } else {
    //     return response.status(422).send({
    //       status: 'error',
    //       message: 'Something went wrong while creating account',
    //       meta: error.message,
    //     });
    //   }
    // }
  }

  async update(id: string, request: UpdateUserDto, response): Promise<any> {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      companyId,
      doctorId,
    } = request;

    // const data: UpdateUserDto = {
    //   firstName,
    //   lastName,
    //   email: email,
    //   phone: phone,
    //   address,
    //   doctorId,
    //   // companyId,
    // };

    // if (doctorId) {
    //   data.doctorId = doctorId;
    // }

    // if (companyId) {
    //   data.companyId = companyId;
    // }

    try {
      if (email) {
        const emailExists = await this.prisma.user.findFirst({
          where: {
            email,
            id: { not: id },
          },
        });
        if (emailExists) {
          return response.status(422).send({
            status: 'error',
            message: 'User already exists with this email',
          });
        }
      }
      await this.prisma.user.update({
        where: { id },
        // data: data,
        data: {
          firstName,
          lastName,
          email: email ?? undefined,
          phone,
          address: address ?? undefined,
    
   
        },
      });

      return response.status(200).send({
        status: 'success',
        message: 'User updated successfully',
      });
    } catch (error) {
      console.log('error==>', error);
      if (error?.meta?.target == 'User_email_key') {
        return response.status(422).send({
          status: 'error',
          message: 'Account already exists with this email',
        });
      } else {
        return response.status(422).send({
          status: 'error',
          message: 'Something went wrong while updating account',
          meta: error.message,
        });
      }
    }
  }

  async updateStatus(
    id: string,
    request: UpdateUserDto,
    response,
  ): Promise<any> {
    const {} = request;

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          // account_status: account_status,
        },
      });
      return response.status(200).send({
        status: 'success',
        message: 'User status updated successfully',
        // token: token,
        // role: role.name,
      });
    } catch (error) {
      return response.status(422).send({
        status: 'error',
        message: 'Something went wrong while updating account',
        meta: error.message,
      });
    }
  }

  async getUserById(id: string, response): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      
       
      });
      return response.status(200).send({
        data: user,
        status: 'success',
      });
    } catch (error) {
      return response.status(422).send({
        status: 'error',
        message: 'Something went wrong while updating account',
        meta: error.message,
      });
    }
  }

  // async getUsers({
  //   text,
  //   limit,
  //   page,
  //   search,
  // }: GetUsersDto): Promise<UserPaginator> {
  //   if (!page) page = 1;
  //   if (!limit) limit = 30;
  //   const startIndex = (page - 1) * limit;
  //   const endIndex = page * limit;
  //   let data: User[] = await this.prisma.user.findMany({
  //     include: { role: true },
  //   });
  //   if (text?.replace(/%/g, '')) {
  //     data = fuse.search(text)?.map(({ item }) => item);
  //   }

  //   if (search) {
  //     const parseSearchParams = search.split(';');
  //     const searchText: any = [];
  //     for (const searchParam of parseSearchParams) {
  //       const [key, value] = searchParam.split(':');
  //       // TODO: Temp Solution
  //       if (key !== 'slug') {
  //         searchText.push({
  //           [key]: value,
  //         });
  //       }
  //     }

  //     data = fuse
  //       .search({
  //         $and: searchText,
  //       })
  //       ?.map(({ item }) => item);
  //   }

  //   const results = data.slice(startIndex, endIndex);
  //   const url = `/users?limit=${limit}`;

  //   return {
  //     data: results,
  //     ...paginate(data.length, page, limit, results.length, url),
  //   };
  // }

  async getUsers({
    role,
    companyId,
    limit = 30, // Default limit
    page = 1, // Default page
    search,
    haveDevices = false,
  }: GetUsersDto): Promise<UserPaginator> {
    // const now = new Date();

    // await this.prisma.user.updateMany({
    //   data: {
    //     createdAt: now,
    //     updatedAt: now,
    //   },
    // });

    const parsedLimit = Number(limit) || 30; // Ensure parsedLimit is a number
    const parsedPage = Number(page) || 1; // Ensure parsedPage is a number

    const skip = (parsedPage - 1) * parsedLimit;

    // Build the where clause based on the search criteria
    const where: any = {};
    if (role) {
      where.role = role;
    }

    if (companyId) {
      where.companyId = companyId;
    }
    if (haveDevices) {
      where.devices = {
        some: {}, // This checks if the user has at least one associated device
      };
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        // Add other searchable fields here
      ];
    }

    // Fetch users with selected fields and role name, and total count in parallel
    const [results, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        // where,
        where: {
          ...where, // Existing conditions for other fields
        },
        skip,
        take: parsedLimit,
       
       
      }),
      this.prisma.user.count({ where }),
    ]);

    // Generate the pagination URL
    const url = `/users?limit=${parsedLimit}&page=${parsedPage}`;

    return {
      data: results,
      ...paginate(totalCount, parsedPage, parsedLimit, results.length, url),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },

    
    });

    const sanitizedUser = this.sanitizeUser(user);
    return sanitizedUser;
  }

  sanitizeUser(user: any) {
    // console.log('user=>', user);
    const { password, ...sanitized } = user; // Remove the password field
    console.log('sanitized==>', sanitized);
    return sanitized;
  }

  // async findOneWithRolePermissions(userId: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //     include: {
  //       role: {
  //         select: {
  //           name: true,
  //           permissions: true,
  //         },
  //       },
  //     },
  //   });

  //   // if (!user) {
  //   //   throw new NotFoundException(`User with ID ${userId} not found`);
  //   // }

  //   const userPermissions: string[] = JSON.parse(
  //     user.role.permissions as string,
  //   );
  //   return {
  //     ...user,
  //     role: {
  //       ...user.role,
  //       permissions: userPermissions,
  //     },
  //   };
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  AWS_S3_BUCKET = 'ria-lingo';
  BUCKET_BASE_URL = 'https://pub-006088b579004a638bd977f54a8cf45f.r2.dev/';
  BUCKET_REGION = 'auto';
  BUCKET_ENDPOINT =
    'https://5aa5d988e1bde0d278ab9f851dccfa85.r2.cloudflarestorage.com';
  BUCKET_ACCESS_KEY_ID = 'b66fb2c2c143b626a436ec1caa808431';
  BUCKET_SECRET_KEY =
    '7b0b2f0e36f69ed390c425f173c334dab1ef8b0d4fa7f193555f059febf91cea';
  BUCKET_NAME = 'cabtify';
  BUCKET_PUBLIC_URL = 'https://pub-68d352b545a748a29ccb074a3c7ef7ab.r2.dev';

  s3 = new AWS.S3({
    region: this.BUCKET_REGION,
    endpoint: this.BUCKET_ENDPOINT,
    credentials: {
      accessKeyId: this.BUCKET_ACCESS_KEY_ID,
      secretAccessKey: this.BUCKET_SECRET_KEY,
    },
  });

  async s3_upload({ file, bucket, directory, name, mimetype }) {
    const params = {
      Bucket: bucket,
      Key: `${directory}/${name}`,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response: any = await this.s3.upload(params).promise();
      // const { Key, ...formattedResponse } = s3Response;
      return {
        message: 'File Uploaded Successfully!',
        completeUrl: this.BUCKET_BASE_URL + s3Response.key,
        filePath: s3Response.key,
      };
    } catch (e) {
      console.log(e);
    }
  }

  async uploadProfilePicture(file, userId, response) {
    const { originalname } = file;

    const timestamp = Date.now();

    const fileExtension =
      originalname.split('.')[originalname.split('.').length - 1];

    const postAwsUploadPicture = await this.s3_upload({
      file: file.buffer,
      bucket: this.AWS_S3_BUCKET,
      directory: 'profile-pictures' + '/' + userId,
      name: timestamp + '.' + fileExtension,
      mimetype: file.mimetype,
    });

    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          profileImageUrl: postAwsUploadPicture?.filePath,
        },
      });

      return response.status(200).send({
        status: 'success',
        message: 'Profile picture uploaded successfully',
        data: postAwsUploadPicture,
      });
    } catch (error) {
      console.log('error==>', error);
      return response.status(422).send({
        status: 'error',
        message: 'Something went wrong while uploading picture',
        meta: error.message,
      });
    }
  }

  async getAllUserIdsExceptSuperAdmin() {
    return this.prisma.user.findMany({
      where: { role: { not: 'super_admin' } },
      select: {
        id: true,
      },
    });
  }
}
