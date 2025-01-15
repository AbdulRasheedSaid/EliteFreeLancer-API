import Category from "../models/categoryModel.js";
import lodash from "lodash";
export const verifyAuthorOwnership = async (req, res, next) => {
    try {
        const { categoryId } = req.params; // Category ID from request parameters
        const userId = lodash.get(req, "identity.id"); // User ID from req.identity
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        if (category.author.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
//# sourceMappingURL=authorAuth.js.map