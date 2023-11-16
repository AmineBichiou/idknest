import { Module, forwardRef } from '@nestjs/common';
import { OffreStageService } from './offre-stage.service';
import { OffreStageController } from './offre-stage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OffreStageSchema } from './offre-stage.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'OffreStage', schema: OffreStageSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [OffreStageService],
  controllers: [OffreStageController],
})
export class OffreStageModule {}
