import { Body, Controller, Delete, Get, Param, Patch, Res, Headers, HttpStatus, Post,
} from '@nestjs/common';
import { EntrepriseService } from './entreprise.service';
import { Response } from 'express';
import { User } from 'src/user/user.model';
import { LocalStrategy } from 'src/auth/local.auth';

@Controller('entreprise')
export class EntrepriseController {
  constructor(
    private readonly entrepriseService: EntrepriseService,
    private authService: LocalStrategy,
  ) {}
  @Post()
  async addEntreprise(
    @Body('user') user: User,
    @Body('localisation') localisation: string,
    @Body('secteur') secteur: string,
  ) {
    const generatedId = await this.entrepriseService.insertEntreprise(
      user,
      localisation,
      secteur,
    );
    return { id: generatedId };
  }
  @Get()
  async getAllEntreprises(
    @Res() res: Response,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.split(' ')[1];
    const userFound = await this.authService.validateUser(token);

    if (!userFound)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    else {
      const entreprises = await this.entrepriseService.getEntreprises();
      return entreprises;
    }
  }
  @Get(':id')
  async getEntreprise(
    @Param('id') id: string,
    @Res() res: Response,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.split(' ')[1];
    const userFound = await this.authService.validateUser(token);

    if (!userFound)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    else {
      return this.entrepriseService.getSingleEntreprise(id);
    }
  }
  @Patch(':id')
  async updateEntreprise(
    @Res() res: Response,
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body('localisation') localisation: string,
    @Body('secteur') secteur: string,
  ) {
    const token = authHeader.split(' ')[1];
    const userFound = await this.authService.validateUser(token);

    if (!userFound)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    else {
      await this.entrepriseService.updateEntreprise(id, localisation, secteur);
      return 'Updated Successfully';
    }
  }
  @Delete(':id')
  async removeEntreprise(
    @Param('id') Id: string,
    @Res() res: Response,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.split(' ')[1];
    const userFound = await this.authService.validateUser(token);

    if (!userFound)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    else {
      await this.entrepriseService.deleteEntreprise(Id);
      return 'Deleted Successfully';
    }
  }
}
