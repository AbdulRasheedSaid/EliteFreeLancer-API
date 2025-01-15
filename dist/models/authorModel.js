import mongoose from "mongoose";
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Author name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name must not exceed 50 characters"],
    },
    image: {
        type: String,
        trim: true,
        required: false,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)?([\w-]+.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(v);
            },
            message: (props) => `${props.value} is not a valid URL!`,
        },
    },
    bio: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return v.length >= 10;
            },
            message: "Bio must be at least 10 characters long",
        },
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
    country: {
        type: String,
        trim: true,
        required: false,
        minlength: [2, "Country must be at least 2 characters long"],
    },
    city: {
        type: String,
        required: false,
        trim: true,
        minlength: [2, "City must be at least 2 characters long"],
    },
    region: {
        type: String,
        required: false,
        trim: true,
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\+?[1-9]\d{1,14}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    languages: {
        type: [String],
        required: false,
        // validate: {
        //   validator: function (v: string[]) {
        //     return v.length > 0;
        //   },
        //   message: "Languages cannot be empty",
        // },
    },
    qualification: {
        type: String,
        required: false,
        trim: true,
        minlength: [5, "Qualification must be at least 5 characters long"],
    },
}, {
    timestamps: true
});
const Author = mongoose.model("Author", authorSchema);
export const getAuthors = () => Author.find();
export const getAuthorByEmail = (email) => Author.findOne({ email });
export const getAuthorById = (id) => Author.findById(id);
export const createAuthor = (values) => new Author(values)
    .save().then((author) => author.toObject);
export const deleteAuthorById = (id) => Author.findByIdAndDelete({ _id: id });
export const updateAuthorById = (id, values) => Author.findByIdAndUpdate(id, values);
export default Author;
//# sourceMappingURL=authorModel.js.map