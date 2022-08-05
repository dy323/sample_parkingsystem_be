import {Router} from 'express';
import { inputEntry, inputDepart } from '@src/controllers/user';
import {Login} from '@src/controllers/login';

const userRouter = Router();

//User Routes
userRouter.post('/login', Login);

userRouter.post('/in', inputEntry);

userRouter.post('/out', inputDepart);

export default userRouter;

