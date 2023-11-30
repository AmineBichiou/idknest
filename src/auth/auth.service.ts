import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EtudiantService } from 'src/etudiant/etudiant.service';
import { EntrepriseService } from 'src/entreprise/entreprise.service';
import { Entreprise } from 'src/entreprise/entreprise.model';
import { Etudiant } from 'src/etudiant/etudiant.model';

@Injectable()
export class AuthService {
  constructor(
    private etudiantService: EtudiantService,
    private entrepriseService: EntrepriseService,
    private jwtService: JwtService
  ) {}

  async signIn(username, pass) {
    //const user = await this.userService.findOne(username);
    const etudiant = await this.etudiantService.findOne(username);
    const entreprise = await this.entrepriseService.findUser(username);
    const user = etudiant || entreprise;
    if(user){
    if ( user.user.password !== pass) {
      throw new UnauthorizedException('Invalid credentials');
    }
    }
    const payload = { username: user.user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(id: string): Promise<Etudiant | Entreprise | null> {
    const etudiant = await this.etudiantService.findOne(id);
    if (etudiant) {
      return etudiant;
    }
    const entreprise = await this.entrepriseService.findOne(id);
    if (entreprise) {
      return entreprise;
    }

    return null;
  }

  async validateUserByCredentials(email: string, password: string): Promise<Etudiant | Entreprise | null> {
    const etudiant = await this.etudiantService.findOne(email);
    const entreprise = await this.entrepriseService.findOne(email);
    
    if (etudiant && etudiant.user.password === password) {
      return etudiant;
    }

    if (entreprise && entreprise.user.password === password) {
      return entreprise;
    }

    return null;
  }
}

