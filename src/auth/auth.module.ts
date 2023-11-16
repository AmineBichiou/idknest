// auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { LocalStrategy } from './local.auth';
import { PassportModule } from '@nestjs/passport';
import { EntrepriseModule } from 'src/entreprise/entreprise.module';
import { EtudiantModule } from 'src/etudiant/etudiant.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    forwardRef(() => EntrepriseModule),
    forwardRef(() => EtudiantModule),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService, LocalStrategy],
})
export class AuthModule {}
