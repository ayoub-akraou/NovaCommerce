import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type AccessPayload = {
  sub: string;
  email: string;
  role: string;
  tokenType?: 'access' | 'refresh';
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization: string | undefined = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer'))
      throw new UnauthorizedException('Missing access token.');

    const token = authorization.split(' ').at(-1) ?? '';

    try {
      const payload = await this.jwtService.verifyAsync<AccessPayload>(token);

      if (payload.tokenType !== 'access') {
        throw new UnauthorizedException('Invalid access token.');
      }

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token.');
    }
  }
}
