import moment from 'moment';
import db from '@config/DB';
import {v4 as uuidv4} from 'uuid';
import status from "http-status";
import {IDaosResp, IAddUser, IUpdateMembership, IAssignSlot, IRegisterSchedule, IDepartSchedule, ILocateMembership} from '../../Interface';
import {encryptAES} from "@src/utils/helper";

//list all current registered user
export function getAll():IDaosResp {
    return db("user")
    .leftJoin('member_ship', 'user.member', 'member_ship.member')
    .select()
    .then((resp:any) => {
        return {
            status: status.OK,
            data: resp
        }
    })
    .catch(() => {
        return {
            status: status.INTERNAL_SERVER_ERROR,
            data: "Failed to search"
        }
    })

}

//Add user membership, details, slots
export function addUser({username, psw, nric, email, phone, membership, slot}:IAddUser):IDaosResp {

    const memberId = Date.now();

    return db("member_ship").insert({
            member: memberId,
            start: membership == 2 ? moment().format('YYYY-MM-DD') : null,
            end: membership == 2 ? moment().add(30, 'days').format('YYYY-MM-DD') : null,
            type: membership
    }).then(()=>{
        return db("user").insert(
        {
            uuid: uuidv4(),
            username: username,
            psw: encryptAES(psw),
            nric: nric,
            member: memberId,
            email: email,
            phone: phone
        }
    )}).then(()=> {

        if (membership == 2) {
            return db("reserved_slot").insert(slot.map((i)=> {
                return (
                    {
                        member: memberId,
                        slot: i,
                    }
                )
            })).then(()=>{
                return {
                    status: status.OK,
                    data: "Successfully added membership, personal details and slot"
                }
            })
            .catch((err:any)=> {
                console.log(err)
                throw new Error()
            })

        }

        return {
            status: status.OK,
            data: "Successfully added membership and personal details"
        }

    }).catch((err:any) => {
        console.log(err)
        return {
            status: status.INTERNAL_SERVER_ERROR,
            data: "Failed to add"
        }
    })
    

}

//use uuid get membership no
function locateMemberShip(uuid: string):ILocateMembership{
    return db("user")
    .where("uuid", "=", uuid)
    .first("member")
    .catch((err:any) => {
        console.log(err)
        return {
            status: status.INTERNAL_SERVER_ERROR,
            data: "Failed to locate user details, maybe doesnt exist"
        }
    })
}

//Change membership
export async function changeMemberShip({uuid, type}:IUpdateMembership): Promise<IDaosResp> {

    //locate serial no of member, else user doesnt exist
    const subQ1 = await locateMemberShip(uuid);

    if (subQ1.status == status.INTERNAL_SERVER_ERROR) {
        return {
            status: subQ1.status,
            data: subQ1.data
        }
    }

    //update membertype
    return await db("member_ship")
    .where("member", subQ1.member)
    .update({
        type: type,
        start: type == 2 ? moment().format('YYYY-MM-DD') : null,
        end: type == 2 ? moment().add(30, 'days').format('YYYY-MM-DD') : null
    }).then(()=>{
        if (type == 1) {
            return db("reserved_slot")
            .where('member', subQ1.member)
            .del();
        }
    }).then(()=>{
        return {
            status: status.OK,
            data: "Successfully update membership"
        }
    }).catch((err:any) => {
        console.log(err)
        return {
            status: status.INTERNAL_SERVER_ERROR,
            data: "Failed to update membership"
        }
    })

}

//Assign slots
export async function assignParkSlot({uuid, slot}:IAssignSlot): Promise<IDaosResp> {

    //locate serial no of member, else user doesnt exist
    const subQ1 = await locateMemberShip(uuid);

    if (subQ1.status == status.INTERNAL_SERVER_ERROR) {
        return {
            status: subQ1.status,
            data: subQ1.data
        }
    }

    return await db("member_ship")
    .where("member", subQ1.member)
    .first("type")
    .then((resp:number)=>{

        if (resp == 1) {
            return {
                status: status.UNAUTHORIZED,
                data: "Only seasonal membership is allowed for slots"
            }
        }

        return db("reserved_slot")
        .where("member", subQ1)
        .insert(slot.map((i)=> {
            return (
                {
                    member: subQ1.member,
                    slot: i,
                }
            )
        })).then(()=>{
            return {
                status: status.OK,
                data: "Successfully added slot"
            }
        }).catch((err:any) => {
            console.log(err)
            throw new Error()
        })

    }).catch((err:any) => {
        console.log(err)
        return {
            status: status.INTERNAL_SERVER_ERROR,
            data: "Failed to add slot"
        }
    })

}

//Record entry schedule
export async function enterEntryTime({uuid, plate}:IRegisterSchedule): Promise<IDaosResp> {

    //Generate random serial no
    const serial = Math.floor(Math.random() * 10000000);
    
    let subQ1;

    //Check if member exists
    if (uuid) {
        subQ1 = await locateMemberShip(uuid);

        if (subQ1.status == status.INTERNAL_SERVER_ERROR) {
            return {
                status: subQ1.status,
                data: subQ1.data
            }
        }
    }

    //Record entry transaction and schedules
    return await db("transaction").insert({
        id: serial,
        order_no: uuid??null,
        plate: plate, //refer to another project for OCR numbers detection
        price: null,
    }).then(()=>{
        return db("punch_in").insert({
            id: serial,
            in_date: moment().format('YYYY-MM-DD'),
            in_time: moment().format("HH:mm:ss")
        })
    }).then(()=>{
        return db("punch_out").insert({
            id: serial,
            out_date: null,
            out_time: null
        })
    }).then(()=>{
        return {
            status: status.OK,
            data: "Successfully entry schedule"
        }
    }).catch((err:any) => {
        console.log(err)
        return {
            status: status.INTERNAL_SERVER_ERROR,
            data: "Failed to record entry schedule"
        }
    })

}

//Calculate bill, if uuid as params, consider seasonal; if plate only, consider normal
export async function enterDepartTime({uuid, plate}: IRegisterSchedule): Promise<IDepartSchedule> {

    let subQ1;
    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment();
    let day = await db("rate").where("day", "=", moment().day()).first();
    let sum:number = 0;

    //Check if member exists
    if (uuid) {
        subQ1 = await locateMemberShip(uuid);

        if (subQ1.status == status.INTERNAL_SERVER_ERROR) {
            return {
                status: subQ1.status,
                data: subQ1.data
            }
        }
    }

    //Retrieve entire transaction
    let trc = await db("transaction")
    .where((builder:any)=>{
        if(uuid){
            builder.where("order_no", "=", uuid);
        } else {
            builder.where("plate", "=", plate)
        }
    })
    .where("price", null)
    .leftJoin("punch_in", "transaction.id", "=", "punch_in.id")
    .leftJoin("punch_out", "transaction.id", "=", "punch_out.id")
    .first()
    .catch((err:any) => {
        console.log(err)
        return {
            status: status.INTERNAL_SERVER_ERROR,
            data: "Failed to locate transaction, maybe doesnt exist"
        }
    })

    let totalHour:number = currentTime.diff(moment(trc.in_time, "HH:mm:ss"), 'hours');

    //Calculate after 12am
    if (totalHour<0) {
        totalHour += 24;
    }

    //for seasonal member
    if (subQ1?.member == 2) {

        return await db("transaction")
        .where('order_no', '=', uuid)
        .where("price", null)
        .update({
            price: 0.00,
        }).then(()=> {
            return db("punch_out")
            .where("id", "=", trc.id)
            .update({
                out_date: currentDate,
                out_time: moment(currentTime).format("HH:mm:ss")
            }).catch((err:any)=>{
                console.log(err)
                throw err;
            })
        }).then(()=>{
            return {
                status: 200,
                data: {
                    price: 0.00,
                    uuid: uuid?? null,
                    plate: plate?? null,
                    schedule: totalHour
                }
            }
        }).catch((err:any)=>{
            console.log(err)
            return {
                status: status.INTERNAL_SERVER_ERROR,
                data: "Failed to checkout for seasonal member"
            }
        })

    }

    //for regular member

    for (let i = 1; i <= totalHour; i++) {
        if (sum < parseFloat(day.max)) {
            if (i == 1) {
                sum += parseFloat(day.first);
            } else if (i == 2) {
                sum += parseFloat(day.second);
            } else {
                sum += parseFloat(day.remaining);
            }
        } else {
            sum = parseFloat(day.max);
        }
    }

    return await db("transaction")
    .where('id', '=', trc.id)
    .where("price", null)
    .update({
        price: sum,
    }).then(()=> {
        return db("punch_out")
        .where("id", "=", trc.id)
        .update({
            out_date: currentDate,
            out_time: moment(currentTime).format("HH:mm:ss")
        }) 
    }).then(()=>{
        return {
            status: 200,
            data: {
                price: sum,
                uuid: uuid?? null,
                plate: plate?? null,
                Hour: totalHour
            }
        }
    }).catch((err:any)=>{
        console.log(err)
        return {
            status: status.INTERNAL_SERVER_ERROR,
            data: "Failed to checkout for normal member"
        }
    })

}

