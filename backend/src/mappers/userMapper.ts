import { UserType } from "../dto/userDTO";


export class UserMapper {
    static toDTO(user:any):UserType {
        return {
            id:user.id,
            name:user.name,
            email:user.email,
        }
    }
}