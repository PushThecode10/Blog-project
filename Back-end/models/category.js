import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite & memory leak
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
