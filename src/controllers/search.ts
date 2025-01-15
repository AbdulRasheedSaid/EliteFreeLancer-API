// Required imports
import express from 'express';
import Category from 'models/categoryModel.js';

// Search API
const searchCategory = async (req: express.Request, res: express.Response) => {
  try {
    // Extract query parameters
    const { 
      search, // for title, category, and author name
      sortField, // for region, city, languages, or qualifications
      sortOrder = 'asc', // ascending or descending
      page = 1, 
      limit = 10 
    } = req.query;

    // Build search filter
    const searchFilter: any = {};
    if (search) {
      searchFilter.$or = [
        { title: { $regex: search, $options: 'i' } },          // Searches title (indexed in category schema)
        { category: { $regex: search, $options: 'i' } },      // Searches category (indexed in category schema)
        { 'author.name': { $regex: search, $options: 'i' } }, // Searches author name (indexed in author schema)
      ];
    }

    // Build sorting filter
    let sortFilter: any = {};
    if (sortField) {
      sortFilter[`author.${sortField}`] = sortOrder === 'asc' ? 1 : -1;
    }

    // Pagination setup
    const skip = (Number(page) - 1) * Number(limit);

    // Perform search with sorting and pagination
    const results = await Category.find(searchFilter)
      .populate({
        path: 'author',
        select: 'name region city languages qualifications',
        options: { collation: { locale: 'en', strength: 2 } }, // Ensures case-insensitive sorting for populated fields
      })
      .sort(sortFilter) // Uses indexes for sorting if sortField matches indexed fields
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination metadata
    const totalCount = await Category.countDocuments(searchFilter);

    res.json({
      data: results,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ message: 'An error occurred while searching.' });
  }
};

export default searchCategory;
