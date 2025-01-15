import express from "express";
import authenticaation from "./authenticaation.js";
import users from "./users.js";
const router = express.Router();
export default () => {
    authenticaation(router);
    users(router);
    console.log('routes loaded');
    return router;
};
//# sourceMappingURL=index.js.map