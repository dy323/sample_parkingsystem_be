import {JWT_SECRET_KEY} from "@config/config"
import db from "@config/DB";
import {rs} from "@config/redis";
import 'crypto-js';
import {ICredential, ISignIn} from "../../Interface";
import status from "http-status";
import {decryptAES, encodeJWT} from "@src/utils/helper";

export async function signIn({username, password}:ICredential):Promise<ISignIn> {

    let refreshList:string[] = await rs.sMembers("jwtRT");

    return db("user")
    .where('username', '=', username)
    .first("psw", "uuid")
    .then((resp:{psw: string, uuid: string}) => {

        if (password == decryptAES(resp.psw)){
            
            return {
                status: status.OK,
                message: "Login Successfully",
                token: {
                    accessToken: encodeJWT(JWT_SECRET_KEY??"", resp.uuid, 180),
                    refreshToken: encodeJWT(JWT_SECRET_KEY??"", refreshList[Math.floor(Math.random() * 5)], 300),
                }
            }

        }

        throw new Error()

    }).catch((err:string) => {
        console.log(err);
        return {
            status: status.UNAUTHORIZED,
            message: "Invalid username or password"
        }
    })

}

