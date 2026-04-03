import { UserType } from "../../dto/userDTO";

export interface IUserSignup {
    exicute(name:string,email:string,password:string):Promise<{success:boolean,message:string,accessToken:string,refreshToken:string,user:UserType}>
}