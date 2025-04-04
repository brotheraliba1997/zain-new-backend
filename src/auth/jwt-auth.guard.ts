import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { ROLES_KEY } from 'src/decorators/roles.decorators';
import { IS_PUBLIC_KEY } from 'src/decorators/public-route.decorators';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // console.log('token=>', token);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // console.log('payload==>', payload, payload.sub);
      // const user = await this.userService.findOne(payload.id);

      const user = payload;
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach user to request for further access in decorators
      request['user'] = user;

      // Check if user role matches required roles
      if (requiredRoles && !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Insufficient role privileges');
      }

      return true;
    } catch (err) {
      // console.log('err=>', err.response.statusCode);
      if (err.response.statusCode == 403) {
        throw new ForbiddenException('Insufficient role privileges');
      }
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
