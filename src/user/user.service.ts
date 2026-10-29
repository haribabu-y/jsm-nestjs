import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {

    constructor(
        private readonly loggerService: LoggerService,
        @InjectModel(User.name) private userModel: Model<User>
    ){}


    async findAllUser(name: string = '') {
        this.loggerService.logMessage("Finding all the users");
        const users: User[] =  await this.userModel.find().exec();
        return users.filter((user) => {
            return user.name.toLowerCase().includes(name.toLowerCase());
        })
    }

    async findOneUser(id: string) {
        this.loggerService.logMessage(`Finding user ${id}`);
        const user = await this.userModel.findById(id).exec();
        console.log(user);        
        if(!user) {
            throw new NotFoundException("User not Found");
        }
        return user;
    }

    async createUser(dto: CreateUserDto) {
        this.loggerService.logMessage("Creating user");

        // const createdUser = new this.userModel({
        //     name: dto.name,
        //     email: dto.email
        // })
        // return createdUser.save()

        return this.userModel.create(dto);
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        this.loggerService.logMessage(`Updating user ${id}`);
        if(!isValidObjectId(id)){
            throw new BadRequestException("Invalid User ID");
        }

        const user = await this.userModel.findOneAndReplace(
            {_id: id},
            dto,
            {new: true, runValidators: true}
        );
        if(!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    async patchUser(id: string, dto: UpdateUserDto) {
        if(!isValidObjectId) {
            throw new BadRequestException("Invalid User Id");
        }
        const user = await this.userModel.findByIdAndUpdate(
            id,
            {$set: dto},
            {new: true, runValidators: true}
        ).exec();
        if(!user) {
            throw new NotFoundException("User not found");
        } 
        return user;
    }

    async deleteUser(id: string) {
        this.loggerService.logMessage("Deleting user " + id);

        if(!isValidObjectId) {
            throw new BadRequestException("Invalid user Id");
        }

        const user = await this.userModel.findByIdAndDelete(id).exec();

        if(!user) {
            throw new NotFoundException("User not found");
        }

        return {
            message: "User successfully Deleted!",
            deleted_user: user
        }
    }

    // findUseryId(id: number) {
    //     this.loggerService.logMessage("Finding the user with id " + id);
    //     return this.users.filter((user) => {
    //         return user.id === id;
    //     })
    // }

    // addNewUser(user: any): UserIn | boolean {
    //     const existingUser = this.users.find((u) => {
    //         return u.name === user.name || u.email === user.email;
    //     })
    //     console.log(existingUser);
    //     if(existingUser?.id) {
    //         return false;
    //     }
    //     const newUser: UserIn = {id: this.users[this.users.length-1].id+1, name: user.name, email: user.email};
    //     this.users.push(newUser);
    //     return newUser;
    // }

    // updateUserById(id: number, user: any): UserIn | boolean {
    //     let userIndex: number = 0;
    //     const existingUser = this.users.find((u, index) => {
    //         userIndex = index;
    //         return u.id == id;
    //     })
    //     if(existingUser) {
    //         const updatedUser = {id: id, ...user};
    //         this.users[userIndex] = updatedUser;
    //         return updatedUser;
    //     }
    //     return false;
    // }

    // deleteUserById(id: number): boolean {
    //     let userIndex: number = 0;
    //     const existinguser = this.users.find((user, index) => {
    //         userIndex = index;
    //         return user.id === id;            
    //     })
    //     console.log(existinguser);
        
    //     if(existinguser) {
    //         this.users.splice(userIndex, 1);
    //         console.log(this.users);
            
    //         return true;
    //     }
    //     return false;

    // }
}
