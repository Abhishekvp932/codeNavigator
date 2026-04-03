import { IUserRepository } from "../../domain/repository/IUserRepository";
import { IUserSignup } from "../../domain/use-cases/IUserSignup";
import { ErrorMessage } from "../../utils/errorMessage";
import { hashPassword } from "../../utils/hash";
import { v4 as uuidv4 } from 'uuid';
import { generateAccessToken, generateRefreshToken, TokenPayload } from "../../utils/jwt";
import { UserType } from "../../dto/userDTO";
import { UserMapper } from "../../mappers/userMapper";
export class UserSignup implements IUserSignup {
    constructor(private _userRepository:IUserRepository){}

    exicute = async(name: string, email: string, password: string): Promise<{ success: boolean; message: string; accessToken: string; refreshToken: string; user:UserType}>=>{
        
        const existsUser = await this._userRepository.findByEmail(email);

        if(existsUser){
            throw new Error(ErrorMessage.USER_ALREADY_EXISTS);
        };

        const hashedPassword = await hashPassword(password);
        const id = uuidv4();
        const newUser = {
            id,
            name,
            email,
            isBlocked:false,
            password:hashedPassword
        };
         
        await this._userRepository.create(newUser);
        const payload : TokenPayload = {
            id:newUser.id,
            name,
            email,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        const mappedUser = UserMapper.toDTO(payload);
        return {success:true,message:"User Create success",accessToken:accessToken,refreshToken:refreshToken,user:mappedUser};
    }
}