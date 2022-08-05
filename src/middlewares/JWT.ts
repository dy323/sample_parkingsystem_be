import {JWT_SECRET_KEY} from "@config/config"
import {Request, Response, NextFunction} from "express";
import {decodeJWT} from "@src/utils/helper";
import status from "http-status";
import {encodeJWT} from "@src/utils/helper";
import {rs} from "@config/redis";

function unauthorizedReport(resp: Response, errorMsg: string){
    resp.clearCookie("ParkAT");
    resp.clearCookie("ParkRT");
    return resp.status(status.UNAUTHORIZED).json({
        message: errorMsg
    })
}

export async function jwtMiddleware(request: Request, response: Response, next: NextFunction) {

    let refreshList:string[] = await rs.sMembers("jwtRT");

    console.log(refreshList)

    //check cookie available
    const accessToken = request.cookies.ParkAT;
    const refreshToken = request.cookies.ParkRT;

    if (!accessToken || !refreshToken) {
        return unauthorizedReport(response, "JWT token not found")
    }

    //Decode jwt
    let at = decodeJWT(JWT_SECRET_KEY??"", accessToken);
    let rt = decodeJWT(JWT_SECRET_KEY??"", refreshToken);

    if (at.status == status.UNAUTHORIZED || rt.status == status.UNAUTHORIZED) {
        return unauthorizedReport(response, "Invalid token")
    }

    //check if token is correct
    if (!await rs.sIsMember("jwtRT", rt?.session?.data)){
        return unauthorizedReport(response, "Refresh token is not genuine")
    }

    //insert into locals to share to others
    response.locals = {
        params: request.body
    }

    console.log(rt);

    //renew tokens to cookie
    response.cookie('ParkAT', encodeJWT(JWT_SECRET_KEY??"", at?.session?.data, 180), {
        maxAge: 10000,
        secure: false,
        httpOnly:false
    })

    response.cookie('ParkRT', encodeJWT(JWT_SECRET_KEY??"", refreshList[Math.floor(Math.random() * 5)], 300), {
        maxAge: 10000,
        secure: false,
        httpOnly:false
    })

    next();

}
