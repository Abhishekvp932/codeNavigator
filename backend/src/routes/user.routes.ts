import {Router} from 'express';
import { UserController } from '../interfaces/controllers/user.controller';
import { UserRepository } from '../infrastructure/repository/user.repository';
import { UserLogin } from '../applications/use-cases/userLogin';
import { UserSignup } from '../applications/use-cases/userSignup';

const router = Router();
const userRepository = new UserRepository();
const userLogin = new UserLogin(userRepository);
const userSignup = new UserSignup(userRepository);
const userController = new UserController(userLogin,userSignup);


router.post('/login',userController.login.bind(userController));
router.post('/signup',userController.signup.bind(userController));
router.get('/logout',userController.logout.bind(userController));
export default router;