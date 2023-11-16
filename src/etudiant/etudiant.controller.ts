
import { Body, Headers, Res, HttpStatus, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EtudiantService } from './etudiant.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { User } from 'src/user/user.model';
import { LocalStrategy } from 'src/auth/local.auth';

@Controller('etudiant')
export class EtudiantController {
    constructor( private readonly etudiantService : EtudiantService, private authService: LocalStrategy){}
    @Post()
    @UseInterceptors(FileInterceptor('Resume', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }))
    async addEtudiant(
      @Body('competences') competences: Array<string>,
      @Body('localisation') localisation: string,
      @Body('user') user: User,
      @UploadedFile() file: Express.Multer.File,
    ) {
      const generatedId = await this.etudiantService.insertEtudiant(competences, localisation,user,file.path);
      
      return { id: generatedId, filePath: file.path };
    }
    @Get()
        async getAllEtudiants(    
          @Res() res: Response,
          @Headers('authorization') authHeader: string
        ){
          if(authHeader){
            const token = authHeader.split(' ')[1];
            const userFound = await this.authService.validateUser(token);
        
            if (!userFound)
              return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
            else {
              const etudiants = await this.etudiantService.getEtudiants();
              return etudiants;
            }
          }
        }
    @Post('/upload')
    @UseInterceptors( FileInterceptor('file', {
         storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    cb(null, file.originalname);
                },
            }),
        }),
    )

        async uploadFile() {
            
            return "success";
        }
    @Get(':id')
        
        async getEtudiant(@Param('id') id: string,           @Res() res: Response,
        @Headers('authorization') authHeader: string) {
          const token = authHeader.split(' ')[1];
          const userFound = await this.authService.validateUser(token);
      
          if (!userFound)
            return res
              .status(HttpStatus.UNAUTHORIZED)
              .json({ message: 'Unauthorized' });
          else {
            return this.etudiantService.getSingleEtudiant(id);
          }
        }
    @Delete(':id')
        async removeEtudiant(@Param('id') Id: string,           @Res() res: Response,
        @Headers('authorization') authHeader: string){
          const token = authHeader.split(' ')[1];
          const userFound = await this.authService.validateUser(token);
      
          if (!userFound)
            return res
              .status(HttpStatus.UNAUTHORIZED)
              .json({ message: 'Unauthorized' });
          else {
            await this.etudiantService.deleteEtudiant(Id);
            return "Deleted Successfully";
        }
      }


        @Patch(':id')
  @UseInterceptors(FileInterceptor('Resume', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }))
  async updateEtudiant(
    @Param('id') id: string,
    @Body('competences') competences: Array<string>,
    @Body('localisation') localisation: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Headers('authorization') authHeader: string
  ) {
    const token = authHeader.split(' ')[1];
    const userFound = await this.authService.validateUser(token);

    if (!userFound)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    else {
      const updatedEtudiant = await this.etudiantService.updateEtudiant(id, competences, localisation, file.path);
      return updatedEtudiant;
    }
  }
}
