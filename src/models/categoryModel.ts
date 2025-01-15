import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters long"],
      maxlength: [50, "Title must not exceed 50 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [2, "Category must be at least 2 characters long"],
      maxlength: [50, "Category must not exceed 50 characters"],
    },
    image: {
      type: String,
      required: [true, "Author image URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\- .\/?%&=]*)?$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    pitch: {
      type: String,
      required: [true, "Pitch is required"],
      minlength: [10, "Pitch must be at least 10 characters long"],
    },
    basicPitch: {
      type: String,
      required: [true, "Basic pitch is required"],
      minlength: [10, "Basic pitch must be at least 10 characters long"],
    },
    standardPitch: {
      type: String,
      required: [true, "Standard pitch is required"],
      minlength: [10, "Standard pitch must be at least 10 characters long"],
    },
    premiumPitch: {
      type: String,
      required: [true, "Premium pitch is required"],
      minlength: [10, "Premium pitch must be at least 10 characters long"],
    },
    basicPrice: {
      type: Number,
      required: [true, "Basic price is required"],
      min: [0, "Price cannot be negative"],
    },
    standardPrice: {
      type: Number,
      required: [true, "Standard price is required"],
      min: [0, "Price cannot be negative"],
    },
    premiumPrice: {
      type: Number,
      required: [true, "Premium price is required"],
      min: [0, "Price cannot be negative"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: [true, "Author reference is required"],
    },
  
  },
  {
    timestamps: true,
  }
);


categorySchema.index({ title: 1 }); // Index on 'title'
categorySchema.index({ category: 1 }); // Index on 'category'


categorySchema.index({ title: 1, category: 1 }); // Optimized for queries involving both fields


categorySchema.index({ title: 'text', category: 'text' });

const Category = mongoose.model("Category", categorySchema);

export default Category;