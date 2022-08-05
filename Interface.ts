import {JwtPayload} from "jsonwebtoken";

//Daos>Login
export interface ICredential {
    username: string,
    password: string,
}

export interface ISignIn {
    status: number,
    message: string,
    token?: {
        accessToken: string,
        refreshToken: string
    }
}

//utils>helper
export interface IDecodeJWT {
    status: number,
    type ?: string,
    message ?: string,
    session ?: JwtPayload,
}

//daos - func response
export interface IDaosResp {
    status: number,
    data ?: {
        id: number,
        username: string,
        psw: string,
        nric: string,
        email: string,
        member: number,
        phone: string,
        start: string,
        end: string,
        type: number,
    } | string
}

//daos>AddUser
export interface IAddUser {
    username: string,
    psw: string,
    nric: string,
    email: string,
    phone: string,
    membership: number,
    slot: string []
}

//daos>UpdateMembership
export interface IUpdateMembership {
    uuid: string,
    type: number,
}

//daos>assignParkSlot
export interface IAssignSlot {
    uuid: string,
    slot: string []
}

//daos>enterEntryTime
export interface IRegisterSchedule {
    uuid?: string,
    plate: string
}

//daos>enterDepartTime
export interface IDepartSchedule {
    status: number,
    data?: {
        price: number,
        uuid: string,
        plate: string,
        schedule: string,
    } | string

}

//daos>locateMembership
export interface ILocateMembership {
    member: number,
    status?: number,
    data?: string
}