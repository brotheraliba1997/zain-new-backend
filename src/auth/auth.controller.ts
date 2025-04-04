import {
  Controller,
  Injectable,
  Post,
  Body,
  Get,
  InternalServerErrorException,
  BadRequestException,
  // Patch,
  // Put,
  // Res,
  // UploadedFile,
} from '@nestjs/common';
// import { CurrentUser } from 'src/decorators/current-user.decorators';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  UpdatePasswordDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import { Public } from 'src/decorators/public-route.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import * as nodemailer from 'nodemailer';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      // const { email, password } = registerDto;

      // Check if user already exists
      // const existingUser = await this.prisma.user.findUnique({
      //   where: { email },
      // });

      // if (existingUser) {
      //   throw new BadRequestException('User with this email already exists');
      // }

      // Hash the password
      // const saltRounds = 10;
      // const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user
      // const newUser = await this.prisma.user.create({
      //   data: {
      //     email,
      //     password: hashedPassword,
      //     ...rest, // Include other fields
      //   },
      // });
      const newUser = await this.userService.create(registerDto);

      // Return sanitized user (without the password)
      return this.userService.sanitizeUser(newUser);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating user: ${error.message}`,
      );
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDTO: LoginDto) {
    const user = await this.authService.findByLogin(loginDTO);

    const tokens = await this.authService.generateTokens(user);
    return {
      success: true,
      message: 'Login Successfully',
      data: { user, tokens },
    };
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // console.log(requestOtpDTO, 'requestOtpDTO');

    const otpData = await this.authService.forgotPassword(forgotPasswordDto);

    if (!otpData) {
      return { success: false, message: 'User not found' };
    }

    await this.sendOtpEmail(otpData.email, otpData.otp);

    return { success: true, message: 'OTP sent successfully' };
  }

  @Public()
  async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hamzaali1997.h@gmail.com',
        pass: 'gzwo igay zmri wltl',
      },
    });

    const mailOptions = {
      from: 'hamzaali1997.h@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    // try {
    const recordFound = await this.authService.findOtp({
      email,
      otp,
    });

    if (!recordFound) {
      throw new BadRequestException('Otp you entered is invalid');
    }

    const currentTime = new Date();
    const expiryTime = new Date(recordFound.expiresAt);

    console.log('Current Time:', currentTime);
    console.log('OTP Expiry Time:', expiryTime);

    if (currentTime > expiryTime) {
      throw new BadRequestException('OTP is expired');
      // await this.prisma.otp.delete({
      //   where: { id: otpRecord.id },
      // });
    }

    // const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    //   expiresIn: '1h',
    // });

    const token = await this.authService.signAccessToken({ email });

    return {
      success: true,
      message: 'OTP verified successfully',
      token,
    };
  }

  @Public()
  @Post('update-password')
  async updatePassword(@Body() updatePasswordOptDto: UpdatePasswordDto) {
    await this.authService.updatePassword(updatePasswordOptDto);

    return {
      success: true,
      message: 'Password is changed successfully',
    };
  }

  // @Get('me')
  // @ApiBearerAuth()
  // getMyProfile(@CurrentUser() user: User): Promise<any> {
  //   // console.log('user=>', user);
  //   return this.authService.me(user);
  // }

  // @Put('me')
  // @ApiBearerAuth()
  // updateMyProfile(
  //   @CurrentUser() user: User,
  //   @Body() updateUserDto: UpdateUserDto,
  //   @Res() response: Response,
  // ): Promise<any> {
  //   console.log('user=>', user);
  //   return this.userService.update(user.id, updateUserDto, response);
  // }
}
