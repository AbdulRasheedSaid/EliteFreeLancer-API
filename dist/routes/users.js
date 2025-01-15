import { deleteUser, getAllUsers, updateUser } from "../controllers/users.js";
import { isAuthenticated, isOwner } from "middleware/authCookie.js";
export default (router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    console.log('users routes loaded');
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
    router.put('/users/:id', isAuthenticated, isOwner, updateUser);
    return router;
};
//# sourceMappingURL=users.js.map