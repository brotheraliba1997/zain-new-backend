import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { Payload } from 'src/types/payload';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  ForgotPasswordDto,
  LoginDto,
  UpdatePasswordDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

interface UserInterface {
  // role: {
  //   name: string;
  //   id: number;
  //   created_at: Date;
  //   updated_at: Date;
  //   permissions: JsonValue; // Ensure this matches the expected type
  // };
  // shops: {
  //   name: string;
  //   id: string;
  //   created_at: Date;
  //   updated_at: Date;
  //   tax_percentage: string;
  //   // Include other properties if needed
  // }[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // async register(authDTO: RegisterDto) {
  //   const { email, password, ...rest } = authDTO;

  //   // Check if user already exists
  //   const existingUser = await this.prisma.user.findUnique({
  //     where: { email },
  //   });

  //   if (existingUser) {
  //     throw new BadRequestException('User with this email already exists');
  //   }

  //   // Hash the password
  //   // const saltRounds = 10;
  //   // const hashedPassword = await bcrypt.hash(password, saltRounds);

  //   try {
  //     // Create a new user0
  //     // const newUser = await this.prisma.user.create({
  //     //   data: {
  //     //     email,
  //     //     password: hashedPassword,
  //     //     ...rest, // Include other fields
  //     //   },
  //     // });
  //     const newUser = await this.userService.create(authDTO);

  //     // Return sanitized user (without the password)
  //     return this.userService.sanitizeUser(newUser);
  //   } catch (error) {
  //     throw new BadRequestException(`Error creating user: ${error.message}`);
  //   }
  // }

  async findOtp({ email, otp }: { email: string; otp: string }) {
    return this.prisma.otp.findFirst({
      where: { email, otp },
    });
  }
  async findByLogin(UserDTO: LoginDto) {
    const { email, password } = UserDTO;
    console.log('Login Email:', email); // Debug email value
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    console.log('user====>', user);

    if (!user) {
      console.error(`User with email ${email} not found`);
      throw new HttpException("User doesn't exist", HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isPasswordValid);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const sanitizedUser = this.userService.sanitizeUser(user);
    return sanitizedUser;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // console.log('Login Email:', email);
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      // throw new Error('User not found');
      throw new BadRequestException('User not found');
    }

    await this.prisma.otp.deleteMany({
      where: { email },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otp.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });
    return { email, otp };
  }

  // async verifyOtp(verifyOtpDto: VerifyOtpDto) {
  //   const { email, otp } = verifyOtpDto;

  //   // try {
  //   const recordFound = await this.prisma.otp.findFirst({
  //     where: { email },
  //   });

  //   if (!recordFound) {
  //     throw new BadRequestException("You haven't requested the otp");
  //   }

  //   const otpRecord = await this.prisma.otp.findFirst({
  //     where: { email, otp },
  //   });

  //   console.log('record found', otpRecord, new Date());

  //   if (!otpRecord) {
  //     throw new BadRequestException('Otp you entered is invalid');
  //   }

  //   const currentTime = new Date();
  //   const expiryTime = new Date(otpRecord.expiresAt);

  //   console.log('Current Time:', currentTime);
  //   console.log('OTP Expiry Time:', expiryTime);

  //   if (currentTime > expiryTime) {
  //     throw new BadRequestException('OTP is expired');
  //     // await this.prisma.otp.delete({
  //     //   where: { id: otpRecord.id },
  //     // });
  //   }

  //   const token = jwt.sign({ email }, process.env.JWT_SECRET, {
  //     expiresIn: '1h',
  //   });

  //   return {
  //     success: true,
  //     message: 'OTP verified successfully',
  //     token,
  //   };
  //   // } catch (error) {
  //   //   console.log('err=>', error);
  //   //   throw new InternalServerErrorException();
  //   // }
  // }

  async signAccessToken(payload: Payload) {
    const expiresIn = 3600 * 24 * 7;
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    const expiresAt = new Date(Date.now() + expiresIn * 1000); // Calculate expiration time

    return { token, expiresAt };
  }

  async signRefreshToken(payload: Payload) {
    const expiresIn = 7 * 24 * 60 * 60;
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    const expiresAt = new Date(Date.now() + expiresIn * 1000); // Calculate expiration time

    return { token, expiresAt };
  }

  async generateTokens(user: any) {
    const access = await this.signAccessToken(user);
    const refresh = await this.signRefreshToken(user);
    return { access, refresh };
  }

  // sanitizeUser(user: any) {
  //   const { password, ...sanitized } = user; // Remove the password field

  //   return sanitized;
  // }

  async me(user: User): Promise<UserInterface> {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        // role: true,
        // shops: true,
      },
    });

    const sanitizedUser = this.userService.sanitizeUser(foundUser);

    return {
      success: true,
      message: 'You are authorized',
      data: sanitizedUser,
    };
  }

  async updateMyProfile(user: User): Promise<UserInterface> {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        // role: true,
        // shops: true,
      },
    });

    const sanitizedUser = this.userService.sanitizeUser(foundUser);

    return {
      success: true,
      message: 'You are authorized',
      data: sanitizedUser,
    };
  }

  async updatePassword(updatePasswordOptDto: UpdatePasswordDto) {
    const { token, password } = updatePasswordOptDto;
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      console.log('decoded=', decoded);
      const email = decoded.email;

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
       });

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }


  
}
