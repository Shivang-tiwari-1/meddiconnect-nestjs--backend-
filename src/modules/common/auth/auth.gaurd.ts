import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/core/user/schema/user-schema';
import { AlsService } from '../als/als.service';
import { IS_PUBLIC_KEY, SKIP_USER_CHECK } from 'src/common/const';

function getMetadata(
  context: ExecutionContextHost,
  reflector: Reflector,
  key: string,
) {
  return reflector.getAllAndOverride<boolean>(key, [
    context.getHandler(),
    context.getClass(),
  ]);
}

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private als: AlsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      //extract the metadata of the req
      const isPublic = getMetadata(
        context as unknown as ExecutionContextHost,
        this.reflector,
        IS_PUBLIC_KEY,
      );
      if (isPublic) {
        console.log('object');
        return true;
      } else {
        console.log('this api is no public');
      }

      const req = context.switchToHttp().getRequest<{
        headers: { authorization: string; userid: string };
        user: Record<string, unknown>;
        userData: UserDocument;
      }>();

      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization Bearer token not found');
      }
      console.log('authHeader', req.headers);
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new Error('Authorization Bearer token not provided');
      }

      const payload = await this.jwtService
        .verifyAsync(token, {
          secret: process.env.SUPABASE_JWT_KEYS,
        })
        .catch(() => {
          throw new Error('jwtExpired');
        });
      req['user'] = payload;

      const userid = req.headers['userid'];
      const skipUserCheck = getMetadata(
        context as unknown as ExecutionContextHost,
        this.reflector,
        SKIP_USER_CHECK,
      );
      if (skipUserCheck) {
        const user = await this.userModel.findById<UserDocument>(
          payload.user_metadata.userid,
        );
        if (!user) {
          throw new Error('Invalid user ID');
        }
        req['userData'] = user;
      }
      this.als.setUserId(userid);
      this.als.setRole(payload.user_metadata.role);
      return true;
    } catch (error) {
      throw new ForbiddenException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
