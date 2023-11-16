import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor( private readonly userService : UserService){}
    
    @Post()
        async addUser(
            @Body('nom') nom: string,
            @Body('email') email: string,
            @Body('password') password: string,
        ){
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
