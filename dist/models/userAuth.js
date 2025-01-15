import mongoose from "mongoose";
const userAuth = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Author name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name must not exceed 50 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    }
});
const User = mongoose.model("User", userAuth);
export const getUsers = () => { User.find(); };
export const getUserByEmail = (email) => User.findOne({ email });
export const getUserBySessionToken = (sessionToken) => User.findOne({
    'authentication.sessionToken': sessionToken
});
export const getUserById = (id) => User.findById(id);
export const createUser = (values) => new User(values)
    .save().then((userAuth) => userAuth.toObject);
export const deleteUserById = (id) => User.findByIdAndDelete({ _id: id });
export const updateUserById = (id, values) => User.findByIdAndUpdate(id, values);
export default User;
//# sourceMappingURL=userAuth.js.map