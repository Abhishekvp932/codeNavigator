import { Request, Response } from "express";
import { IUserLogin } from "../../domain/use-cases/IUserLogin";
import { HttpStatusCode } from "../../utils/httpStatusCode";
import { IUserSignup } from "../../domain/use-cases/IUserSignup";
import dotenv from 'dotenv';
dotenv.config();
export class UserController { 
   constructor(private _userLogin:IUserLogin , private _userSignup:IUserSignup){}

   login = async(req:Request,res:Response):Promise<void>=>{
    // console.log('user login request is comming ....');
    try {
        const {email,password} = req.body;

        const result = await this._userLogin.execute(email,password);
        if(result.success && "accessToken" in result){
            const r = result as {accessToken?:string;refreshToken?:string};

            res.cookie('accessToken',r.accessToken ?? "",{
                httpOnly:true,
                secure:false,
                sameSite:'none',
                maxAge:Number(process.env.ACCESS_TOKEN_EXPIRE_TIME),

            });
            res.cookie('refreshToken',r.refreshToken ?? "",{
                 httpOnly:true,
                secure:false,
                sameSite:'none',
                maxAge:Number(process.env.REFRESH_TOKEN_EXPIRE_TIME),

            })
        }
        res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
       const err = error as Error;

       res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:err.message});
    }
   }

   signup = async(req:Request,res:Response):Promise<void>=>{
    try {
        // console.log('signup request is comming to backend .....');
        const {name,email,password} = req.body;

        const result = await this._userSignup.exicute(name,email,password);
         if(result.success && "accessToken" in result){
            const r = result as {accessToken?:string;refreshToken?:string};

            res.cookie('accessToken',r.accessToken ?? "",{
                httpOnly:true,
                secure:false,
                sameSite:'none',
                maxAge:Number(process.env.ACCESS_TOKEN_EXPIRE_TIME),

            });
            res.cookie('refreshToken',r.refreshToken ?? "",{
                 httpOnly:true,
                secure:false,
                sameSite:'none',
                maxAge:Number(process.env.REFRESH_TOKEN_EXPIRE_TIME),

            })
        }
        res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
        console.log(error);
        const err = error as Error;
        res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:err.message});
    }
   }

   logout = async (req:Request,res:Response):Promise<void>=>{
    console.log('logout request is comming ...');
     try {
         res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "none",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure:false,
        sameSite: "none",
      });
          res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Logged out successfully",
      });
      return;
     } catch (error) {
        const err = error as Error;
        res.status(HttpStatusCode.BAD_REQUEST).json({success:false,message:err.message});
        return;
     }
   }
};