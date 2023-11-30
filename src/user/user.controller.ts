import { Body, Controller, Delete, Get, Param, Patch, Post,Headers, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    authService: any;
    constructor( private readonly userService : UserService){}
    @Post()
        async addUser(
            @Res() res: Response,
            @Headers('authorization') authHeader: string,
            @Body('nom') nom: string,
            @Body('email') email: string,
            @Body('password') password: string,
        ){
            let token = authHeader.split(' ')[1];
      let userFound = await this.authService.validateUser(token);

      if (!userFound) return res.status(HttpStatus.UNAUTHORIZED).json({message: "Unauthorized"});
            const generatedId = await this.userService.insertUser(nom, email, password);
            return { id: generatedId };
        }
    @Get()
        async getAllUsers(){
            const users = await this.userService.getUsers();
            return users;
        }
    @Get(':id')
        getUser(@Param('id') id: string) {
          return this.userService.getSingleUser(id);
        }
    @Patch(':id')
        async updateUser(
            
            @Param('id') id: string,
            @Body('nom') nom: string,
            @Body('email') email: string,
            @Body('password') password: string,
        ){
            await this.userService.updateUser(id, nom, email, password);
            return "Updated Successfully";
        }
    @Delete(':id')
        async removeUser(@Param('id') Id: string){
            await this.userService.deleteUser(Id);
            return "Deleted Successfully";
        }
    

}
