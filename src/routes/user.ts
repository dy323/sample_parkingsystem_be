import {Router} from 'express';
import { inputEntry, inputDepart } from '../controllers/user';
import {Login} from '../controllers/login';

const userRouter = Router();

//User Routes
userRouter.post('/login', Login);

userRouter.post('/in', inputEntry);

userRouter.post('/out', inputDepart);

export default userRouter;

