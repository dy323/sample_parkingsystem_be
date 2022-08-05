import {sign, verify} from "jsonwebtoken";
import status from "http-status";
import { IDecodeJWT } from "Interface";
import * as CryptoJS from "crypto-js";
import {AES_SECRET_KEY, AES_BASE64_IV } from "@config/config";

const base64SECRET  = CryptoJS.enc.Base64.parse(AES_SECRET_KEY??"");
const base64IV  = CryptoJS.enc.Base64.parse(AES_BASE64_IV??"");

//Encode JWT Token
export function encodeJWT(secret: string, credential: string | {}, duration: number): string {
    return sign({data: credential}, secret, {expiresIn: duration})
}


//Decode JWT Token
export function decodeJWT(secret: string, token: string): IDecodeJWT {

    let result: {};

    try {
        result = verify(token, secret);
    } catch (err:any) {
        return {
            status: status.UNAUTHORIZED,
            type: err.name,
            message: err.message
        }
    }

    return {
        status: 200,
        session: result
    }

}

//Encrypt AES Token
export function encryptAES(data: string):string {
    return CryptoJS.AES.encrypt(data, base64SECRET, {iv: base64IV}).toString();
}

//Decrypt AES Token
export function decryptAES(data: string):string {
    return CryptoJS.AES.decrypt(data, base64SECRET, {iv: base64IV}).toString(CryptoJS.enc.Utf8);
}

//Generate five string on array for some usecase
export function generateRandomFive():string[]{
    let randNumbers:string[] = [];

    //generate 5 random string
    for (let i:number=0; i<5; i++) {
        randNumbers.push(String(Math.floor(10000000 + Math.random() * 9000)))
    }

    //testing key
    randNumbers = ["59874261", ...randNumbers]

    return randNumbers;
}

