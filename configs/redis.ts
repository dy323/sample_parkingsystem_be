import {REDIS_PORT, REDIS_PASSWORD, REDIS_URI} from "./config";
const redis = require("redis");

let rs:any;

export default (async (): Promise<void> => {

    rs = redis.createClient({
        url: `redis://default:${REDIS_PASSWORD}@${REDIS_URI}:${REDIS_PORT}`,
    })

    rs.on("error", (err:any)=> console.log(err))

    return await rs.connect();
})

export {rs}


