import lodash from 'lodash';
import { getUserBySessionToken } from 'models/userAuth.js';
export const isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = lodash.get(req, 'identity.id');
        if (!currentUserId) {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        if (currentUserId.toString() !== id) {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
};
export const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = req.cookies['sessionToken'];
        if (!sessionToken) {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        lodash.merge(req, { identity: user });
        return next();
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
};
//# sourceMappingURL=authCookie.js.map