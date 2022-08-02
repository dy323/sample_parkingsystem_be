import {getAll, addUser, changeMemberShip, assignParkSlot, enterEntryTime, enterDepartTime} from '@src/daos/user';
import {Request, Response} from 'express';

//Get User List
export async function getAllUser(req:Request, res: Response) {

    const result = await getAll();
    
    return res.status(result.status).json(result.data);
}

//Add New User, membership and slots
export async function inputUser(req:Request, res: Response) {
    
    const result = await addUser(res.locals.params);
    
    return res.status(result.status).json(result.data);

}

//Edit Membership - regular or Seasonal 
export async function editMemberShip(req:Request, res: Response) {

    const result = await changeMemberShip(res.locals.params);
    
    return res.status(result.status).json(result.data);

}

//Assign Parking Slot for Seasonal member
export async function assignSlot(req:Request, res:Response) {

    const result = await assignParkSlot(res.locals.params);
    
    return res.status(result.status).json(result.data);

}

//Insert entry time 
export async function inputEntry(req:Request, res:Response) {

    const result = await enterEntryTime(req.body);
    
    return res.status(result.status).json(result.data);

}

//Insert depart time
export async function inputDepart(req:Request, res:Response) {

    const result = await enterDepartTime(req.body);
    
    return res.status(result.status).json(result.data);

}
