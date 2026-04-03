import mongoose, { Document, Schema } from "mongoose";

export interface IUserModel extends Document { 
    id:string
    name : string; 
    email:string;
    password:string;
    isBlocked : boolean;
    createdAt : Date;
    updatedAt : Date;
};

export const  userSchema = new Schema<IUserModel>({

    id : {
        type:String,
        unique:true,
        required:true,
     },
    name : {
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password : {
        type:String,
        required:true,
    },
    isBlocked : {
        type:Boolean,
        default:false,
    },

},{timestamps:true});


const UserModel = mongoose.model('User',userSchema);

export default UserModel;