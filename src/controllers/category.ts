import express from 'express';
import Category from '../models/categoryModel.js';

export const getCategories = async (req: express.Request, res: express.Response) => {
  try {
    const categories = await Category.find().populate("author", "image name");
    console.log(categories);
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const createCategory = async (req: express.Request, res: express.Response) => {
  try {
    const category = req.body;
    const newCategory = new Category(category);
    await newCategory.save();
    res.status(200).json(newCategory);
    console.log('Category created successfully');
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
}

export const getCategoryById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
}

export const deleteCategory = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
}

export const updateCategory = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body)
    res.status(200).json(updatedCategory);
    } catch (error) {
    console.log(error);

    res.status(404).json({ message: error.message });
    }
}