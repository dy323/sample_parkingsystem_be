import {Router} from 'express';
import { getAllUser, inputUser, editMemberShip, assignSlot} from '../controllers/user';
import {jwtMiddleware} from "../middlewares/JWT"

const adminRouter = Router();

//Admin Routes
adminRouter.get('/list', jwtMiddleware, getAllUser);

adminRouter.post('/add', jwtMiddleware, inputUser);

adminRouter.post('/updateMemberShip', jwtMiddleware, editMemberShip);

adminRouter.post('/assignSlot', jwtMiddleware, assignSlot);

export default adminRouter;