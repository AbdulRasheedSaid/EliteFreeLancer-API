import { getUsers, addUser } from "controllers/userController.js";
import express from "express";


const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);

export default router;


// import { fromNodeHeaders } from "better-auth/node";
// import { auth } from "./auth"; //your better auth instance
 
// app.get("/api/me", async (req, res) => {
//  	const session = await auth.api.getSession({
//       headers: fromNodeHeaders(req.headers),
//     });
// 	return res.json(session);
// });