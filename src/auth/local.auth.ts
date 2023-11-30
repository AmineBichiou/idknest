import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Etudiant } from 'src/etudiant/etudiant.model';
import { Entreprise } from 'src/entreprise/entreprise.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private readonly jwtService: JwtService) {
    super();
  }

  async validateUser(token): Promise<Etudiant | Entreprise | null> {
    const decoded:any = this.jwtService.decode(token);
      const user = await this.authService.validateUser(decoded.sub);
      console.log(user)

      if (!user) return null
      return user;
  }
  

}