import express from "express";
import authenticaation from "./authenticaation.js";
import users from "./users.js"

const router = express.Router()

export default (): express.Router => {
    authenticaation(router)
    users(router)
    console.log('routes loaded')
    return router
}

