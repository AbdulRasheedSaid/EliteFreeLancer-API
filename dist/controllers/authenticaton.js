import { createUser, getUserByEmail } from '../models/userAuth.js';
import { authentication, random } from '../helpers/helpers.js';
import { createAuthor } from "../models/authorModel.js";
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.sendStatus(404);
        }
        if (authentication(user.authentication.salt, password) !== user.authentication.password) {
            return res.sendStatus(403);
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();
        res.cookie('sessionToken', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!name || !email || !password) {
            return res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.sendStatus(400);
        }
        const salt = random();
        const user = await createUser({
            email,
            name,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });
        const author = await createAuthor({
            name,
            email,
        });
        console.log("User and Author created successfully:", { user, author });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error }).end();
    }
};
//# sourceMappingURL=authenticaton.js.map