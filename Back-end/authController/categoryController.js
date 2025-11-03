import Category from "../models/category.js";

// ✅ Create a new category (Admin only)
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Prevent duplicates
    const existing = await Category.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    throw new Error({ success:"false", message: error.message});
  }
};

// ✅ Update a category (Admin only)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    throw new Error({ success:"false", message: error.message});
  }
};

// ✅ Delete category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    throw new Error({ success:"false", message: error.message});
  }
};

// ✅ Get all categories (Public)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ categories });
  } catch (error) {
    throw new Error({ success:"false", message: error.message});
  }
};

// ✅ Get single category (Public)
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ category });
  } catch (error) {
    throw new Error({ success:"false", message: error.message});
  }
};
