import Category from '../models/categoryModel.js';
const searchCategory = async (req, res) => {
    try {
        const { query, page = "1", limit = "30" } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        // Convert `page` and `limit` to numbers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 30);
        const results = await Category.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
                { authorName: { $regex: query, $options: "i" } },
            ],
        })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
        res.status(200).json(results);
    }
    catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
export default searchCategory;
//# sourceMappingURL=search.js.map