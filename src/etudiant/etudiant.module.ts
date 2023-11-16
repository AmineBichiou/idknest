// etudiant.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { EtudiantController } from './etudiant.controller';
import { EtudiantService } from './etudiant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EtudiantSchema } from './etudiant.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Etudiant', schema: EtudiantSchema }]),
    forwardRef(() => AuthModule)
  ],
  controllers: [EtudiantController],
  providers: [EtudiantService],
  exports: [EtudiantService],
})
export class EtudiantModule {}
