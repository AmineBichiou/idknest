// entreprise.module.ts
import { Module,forwardRef} from '@nestjs/common';
import { EntrepriseService } from './entreprise.service';
import { EntrepriseController } from './entreprise.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EntrepriseSchema } from './entreprise.model';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    MongooseModule.forFeature([{ name: 'Entreprise', schema: EntrepriseSchema }]),forwardRef(() => AuthModule)],
  providers: [EntrepriseService],
  controllers: [EntrepriseController],
  exports: [EntrepriseService],
})
export class EntrepriseModule {}
