import {signIn} from "@src/daos/signIn";
import {Request, Response} from 'express';

export async function Login(req: Request, res: Response)  {

    let result = await signIn(req.body);

    if (result.status == 200) {
        res.cookie('ParkAT', result.token?.accessToken, {
            maxAge: 100000,
            secure: false,
            httpOnly:false
        })
        res.cookie('ParkRT', result.token?.refreshToken, {
            maxAge: 100000,
            secure: false,
            httpOnly:false
        })
    }

    return res.status(result.status).json(result.message);

}
