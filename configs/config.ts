import 'dotenv/config';
require('dotenv').config({path:"../.env"})

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PSW = process.env.DB_PSW
const DB_PORT = process.env.DB_PORT
const LOCAL_USER_PORT = process.env.LOCAL_USER_PORT
const LOCAL_ADMIN_PORT = process.env.LOCAL_ADMIN_PORT
const SAMPLE_SEED_EMAIL_ONE = process.env.SAMPLE_SEED_EMAIL_ONE
const SAMPLE_SEED_EMAIL_TWO = process.env.SAMPLE_SEED_EMAIL_TWO
const SAMPLE_SEED_PHONE_ONE = process.env.SAMPLE_SEED_PHONE_ONE
const AES_SECRET_KEY = process.env.AES_SECRET_KEY
const AES_BASE64_IV = process.env.AES_BASE64_IV

export {JWT_SECRET_KEY, DB_HOST, DB_NAME, DB_USER, DB_PSW, DB_PORT, LOCAL_USER_PORT, LOCAL_ADMIN_PORT, SAMPLE_SEED_EMAIL_ONE, SAMPLE_SEED_EMAIL_TWO, SAMPLE_SEED_PHONE_ONE, AES_SECRET_KEY, AES_BASE64_IV};
