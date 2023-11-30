import { Body, Controller, Delete, Get, Param, Patch, Post,Headers,Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EntrepriseService } from './entreprise.service';
import { Entreprise } from './entreprise.model';
import { User } from 'src/user/user.model';
import { LocalStrategy } from 'src/auth/local.auth';
import { AuthService } from 'src/auth/auth.service';
@Controller('entreprise')
export class EntrepriseController {
    constructor(private readonly entrepriseService: EntrepriseService,private localStrategy : LocalStrategy,private authService : AuthService ) { }
    @Post()
    async addEntreprise(
        @Body('user') user: User,
        @Body('localisation') localisation: string,
        @Body('secteur') secteur: string,
    ) {
        
        const generatedId = await this.entrepriseService.insertEntreprise(user,localisation, secteur);
        const token = await this.authService.signIn( user.email, user.password);
        return { id: generatedId , token};
    }
    @Get()
    async getAllEntreprises(@Res() res: Response, @Headers('authorization') authHeader: string) {
        if (!authHeader) {

            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized tester" });
        }
    
        let token = authHeader.split(' ')[1];
        let userFound = await this.localStrategy.validateUser(token);
    
        if (!userFound) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        }
    
        const entreprises = await this.entrepriseService.getEntreprises();
        console.log(entreprises)
        return entreprises;
    }
    @Get(':id')
    async getEntreprise(@Param('id') id: string/*,@Res() res: Response,
    @Headers('authorization') authHeader: string*/) {
        /*let token = authHeader.split(' ')[1];
      let userFound = await this.localStrategy.validateUser(token);
      if (!userFound) return res.status(HttpStatus.UNAUTHORIZED).json({message: "Unauthorized"});*/
        return this.entrepriseService.getSingleEntreprise(id);
    }
    @Patch(':id')
    async updateEntreprise(
        @Res() res: Response,
        @Headers('authorization') authHeader: string,
        @Param('id') id: string,
        @Body('localisation') localisation: string,
        @Body('secteur') secteur: string,
    ) {
        let token = authHeader.split(' ')[1];
      let userFound = await this.localStrategy.validateUser(token);
      if (!userFound) return res.status(HttpStatus.UNAUTHORIZED).json({message: "Unauthorized"});
        await this.entrepriseService.updateEntreprise(id, localisation, secteur);
        return "Updated Successfully";
    }
    @Delete(':id')
    async removeEntreprise(@Param('id') Id: string,@Res() res: Response,
    @Headers('authorization') authHeader: string) {
        let token = authHeader.split(' ')[1];
      let userFound = await this.localStrategy.validateUser(token);
      if (!userFound) return res.status(HttpStatus.UNAUTHORIZED).json({message: "Unauthorized"});
        await this.entrepriseService.deleteEntreprise(Id);
        return "Deleted Successfully";
    }
    


}