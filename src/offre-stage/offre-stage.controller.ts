import { Body, Headers, Res, HttpStatus, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OffreStageService } from './offre-stage.service';
import { Response } from 'express';
import { Etudiant } from 'src/etudiant/etudiant.model';
import { Entreprise } from 'src/entreprise/entreprise.model';
import { LocalStrategy } from 'src/auth/local.auth';

@Controller('offre-stage')
export class OffreStageController {
    constructor(private readonly offreStageService: OffreStageService, private authService: LocalStrategy) { }
    @Post()
    async addOffreStage(
        @Res() res: Response,
        @Headers('authorization') authHeader: string,
        @Body('titre') titre: string,
        @Body('description') description: string,
        @Body('domaine') domaine: string,
        @Body('candidatures') candidatures: Array<Etudiant>,
        @Body('competences') competences: Array<string>,
        @Body('localisation') localisation: string,
        @Body('date_debut') date_debut: Date,
        @Body('date_fin') date_fin: Date,
        @Body('entreprise') entreprise: Entreprise,
    ) {
        const token = authHeader.split(' ')[1];
        const userFound = await this.authService.validateUser(token);
    
        if (!userFound)
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        else {
            const generatedId = await this.offreStageService.insertOffreStage(titre, description, domaine, candidatures, competences, localisation ,date_debut, date_fin,entreprise);
            return { id: generatedId };
        }
    }
    @Get()
    async getAllOffresStage(          @Res() res: Response,
    @Headers('authorization') authHeader: string) {
        const token = authHeader.split(' ')[1];
        const userFound = await this.authService.validateUser(token);
    
        if (!userFound)
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        else {
            const offresStage = await this.offreStageService.getOffresStage();
            return offresStage;
        }
    }
    @Get(':id')
    async getOffreStage(@Param('id') id: string, @Res() res: Response,
    @Headers('authorization') authHeader: string) {
        const token = authHeader.split(' ')[1];
        const userFound = await this.authService.validateUser(token);
    
        if (!userFound)
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        else {
            return this.offreStageService.getSingleOffreStage(id);
        }
    }
    @Patch(':id')
    async updateOffreStage(
        @Param('id') id: string,
        @Body('titre') titre: string,
        @Body('description') description: string,
        @Body('domaine') domaine: string,
        @Body('competences') competences: Array<string>,
        @Body('localisation') localisation: string,
        @Body('date_debut') date_debut: Date,
        @Body('date_fin') date_fin: Date,
        @Res() res: Response,
        @Headers('authorization') authHeader: string
    ) {
        const token = authHeader.split(' ')[1];
        const userFound = await this.authService.validateUser(token);
    
        if (!userFound)
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        else {
            await this.offreStageService.updateOffreStage(id, titre, description, domaine, competences, localisation ,date_debut, date_fin);
            return "Updated Successfully";
        }
    }
    @Delete(':id')
    async removeOffreStage(@Param('id') Id: string,
    @Res() res: Response,
    @Headers('authorization') authHeader: string) {
        const token = authHeader.split(' ')[1];
        const userFound = await this.authService.validateUser(token);
    
        if (!userFound)
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        else {
            await this.offreStageService.deleteOffreStage(Id);
            return "Deleted Successfully";
        }
    }

}
