
import { User } from "../entity/user";
export interface IUserRepository {
  create(data:User):Promise<User | null>;
  findByEmail(email:string):Promise<User | null>;
}