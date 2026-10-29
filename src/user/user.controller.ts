import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';
import { RoleGuard } from '../guards/role.guard';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    getUsers(@Query('name') name: string): unknown {
        return this.userService.findAllUser(name);
    }

    @Get(':id')
    getUserById(@Param('id') id: string): unknown {
        return this.userService.findOneUser(id);
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto): unknown {
        return this.userService.createUser(createUserDto);
    }

    @Put(":id")
    updateUser(@Param('id') id: string, @Body() updatedUser: UpdateUserDto): unknown {
        return this.userService.updateUser(id, updatedUser);
    }

    @Patch(":id")
    updateUserUsingPatch(@Param("id") id: string, @Body() updatedUser: UpdateUserDto): unknown {
        return this.userService.patchUser(id, updatedUser);
    }

    @Delete(':id')
    @UseGuards(RoleGuard)
    deleteUser(@Param('id') id: string): unknown {
        return this.userService.deleteUser(id);
    }

    // @Get(":id")
    // getUserById(@Param('id') id: string): unknown {
    //     const res: any =  this.userService.findUseryId(parseInt(id));
    //     console.log(res);        
    //     if(res.name) {
    //         return res;
    //     }
    //     return {
    //         message: "User not found with id " + id
    //     }
    // };

    // @Post()
    // createUser(@Body() user: CreateUserDto): unknown {
    //     const res: any = this.userService.addNewUser(user);
    //     if(!res) {
    //         return {message: "Name or Email already exists"};
    //     }
    //     return {
    //         message: "User added successfully",
    //         user: res
    //     }
    // };

    // @Put(":id")
    // updateUser(@Param("id") id: string ,@Body() user: UpdateUserDto) {
    //     const res: any = this.userService.updateUser(parseInt(id), user);
    //     if(res) {
    //         return {
    //             message: "User updated successfully",
    //             user: res
    //         }
    //     }
    //     return {
    //         message: "User not found with id " + id
    //     }
    // }

    // @Delete(":id")
    // deleteUserById(@Param("id") id: string) {
    //     const res = this.userService.deleteUserById(parseInt(id));
    //     if(res) {
    //         return {
    //             message: "User deleted successfully"
    //         }
    //     }
    //     return {message: "User not found with id " + id}
    // }
}
