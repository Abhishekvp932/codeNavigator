import { UserType } from "../../dto/userDTO";




export interface IUserLogin {
  execute(email:string,password:string):Promise<{success:boolean,message:string,accessToken:string,refreshToken:string,user:UserType}>
}