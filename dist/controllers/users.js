import { deleteUserById, getUserById, getUsers } from 'models/userAuth.js';
export const getAllUsers = async (req, res) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);
        return res.status(200).json(deletedUser);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
};
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Name is required' });
        }
        const user = await getUserById(id);
        user.name = name;
        await user.save();
        return res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
};
//# sourceMappingURL=users.js.map