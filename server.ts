import express, {Express} from "express";
import cookieParser from "cookie-parser";
import userRouter from "@src/routes/user";
import adminRouter from "@src/routes/admin";
import {LOCAL_USER_PORT, LOCAL_ADMIN_PORT} from "@config/config"
import initiateStore, {rs} from "@config/redis";
import { generateRandomFive } from "@src/utils/helper";

const userApp: Express = express();
const adminApp: Express = express();

//port 1 - w/Auth
userApp
.use(cookieParser())
.use(express.json())
.use(userRouter)

//port 2 - w Auth
adminApp
.use(cookieParser())
.use(express.json())
.use(adminRouter)

userApp.listen(LOCAL_USER_PORT, async ()=> {
    console.log("user server is running")

    //connect to redis lab
    await initiateStore()
    await rs.flushAll("ASYNC")
    await rs.sAdd("jwtRT", generateRandomFive())

});

adminApp.listen(LOCAL_ADMIN_PORT, ()=> console.log("admin server is running"));
