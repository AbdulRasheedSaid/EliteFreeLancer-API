import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
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
      default: 'https://archive.org/download/instagram-plain-round/instagram%20dip%20in%20hair.jpg',
      validate: {
        validator: function (v: string) {
          return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Only required if not using Google OAuth
      },
      select: false
    },
    bio: {
      type: String,
      validate: {
        validator: function (v: string) {
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
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    country: {
      type: String,
      trim: true,
      default: 'Ghana',
      minlength: [2, "Country must be at least 2 characters long"],
    },
    city: {
      type: String,
      default: 'Accra',
      trim: true,
      minlength: [2, "City must be at least 2 characters long"],
    },
    region: {
      type: String,
      trim: true,
      default: 'Greater Accra'
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    languages: {
      type: [String],
      set: (languages: string[]) => languages.map((lang) => lang.trim()), // Sanitize array elements
      default: ['English']
    },
    qualification: {
      type: [String],
      set: (qualifications: string[]) => qualifications.map((q) => q.trim()), // Sanitize array elements
      default: ['Home School']
    },
  },
  {
    timestamps: true,
  }
);

// Define indexes
authorSchema.index({ name: 1 });
authorSchema.index({ city: 1 });
authorSchema.index({ region: 1 });
authorSchema.index({ languages: 1 });
authorSchema.index({ qualification: 1 });
authorSchema.index({ name: 1, city: 1, region: 1 }); // Compound index

// Model and utility functions
const Author = mongoose.model("Author", authorSchema);

export const getAuthors = () => Author.find();
export const getAuthorByEmail = (email: string) => Author.findOne({ email });
export const getAuthorById = (id: string) => Author.findById(id);
export const createAuthor = (values: Record<string, any>) =>
  new Author(values).save().then((author) => author.toObject());
export const deleteAuthorById = (id: string) => Author.findByIdAndDelete(id);
export const updateAuthorById = (id: string, values: Record<string, any>) =>
  Author.findByIdAndUpdate(id, values, { new: true });
export default Author;
