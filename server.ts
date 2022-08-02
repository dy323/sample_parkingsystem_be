import express, {Express} from "express";
import cookieParser from "cookie-parser";

import userRouter from "./src/routes/user";
import adminRouter from "./src/routes/admin";
import {LOCAL_USER_PORT, LOCAL_ADMIN_PORT} from "@config/config"

const userApp: Express = express();
const adminApp: Express = express();

//port 1
userApp
.use(cookieParser())
.use(express.json())
.use(userRouter)

//port 2
adminApp
.use(cookieParser())
.use(express.json())
.use(adminRouter)

userApp.listen(LOCAL_USER_PORT, ()=> console.log("user server is running"));
adminApp.listen(LOCAL_ADMIN_PORT, ()=> console.log("admin server is running"));