import { getUsers, addUser } from "controllers/userController.js";
import express from "express";


const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);

export default router;


