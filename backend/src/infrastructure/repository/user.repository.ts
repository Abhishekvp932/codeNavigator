import { User } from "../../domain/entity/user";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import UserModel from "../model/user.model";


export class UserRepository implements IUserRepository {
    
    create = async(data: User): Promise<User | null>=>{
         return await UserModel.create(data);
    }

    findByEmail = async(email: string): Promise<User | null>=> {
        return await UserModel.findOne({email:email});
    }
}