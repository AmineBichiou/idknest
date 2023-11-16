import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private readonly jwtService: JwtService) {
    super();
  }

  async validateUser(token): Promise<any> {
    const decoded:any = this.jwtService.decode(token);
      const user = await this.authService.validateUser(decoded.id);

      if (!user) return null
      return user;
  }
  

}