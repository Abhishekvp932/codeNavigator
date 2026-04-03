import { IUserLogin } from "../../domain/use-cases/IUserLogin";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { ErrorMessage } from "../../utils/errorMessage";
import { comparePassword } from "../../utils/hash";
import { generateAccessToken, generateRefreshToken, TokenPayload } from "../../utils/jwt";
import { UserType } from "../../dto/userDTO";
import { UserMapper } from "../../mappers/userMapper";

export class UserLogin implements IUserLogin { 
  constructor(private _userRepository:IUserRepository){}

  execute = async(email: string, password: string): Promise<{ success: boolean; message: string; accessToken: string; refreshToken: string; user:UserType}> =>{

    const user = await this._userRepository.findByEmail(email);

    if(!user){
      throw new Error(ErrorMessage.USER_NOT_FOUND);
    }

    const isPassword = await comparePassword(password,user.password);

    if(!isPassword){
      throw new Error(ErrorMessage.INCORRECT_PASSWORD);
    }

    const payload:TokenPayload ={
      id:user.id.toString(),
      email:user.email,
      name:user.name,

    }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload);
    const mappedUser = UserMapper.toDTO(payload);
    return {success:true,message:'login success',accessToken:accessToken,refreshToken:refreshToken,user:mappedUser};
  }
};