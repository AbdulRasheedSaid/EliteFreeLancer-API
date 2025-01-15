import Author from '../models/authorModel.js';
export const getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        console.log(authors);
        res.status(200).json(authors);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};
export const createAuthor = async (req, res) => {
    try {
        const author = req.body;
        const newAuthor = new Author(author);
        await newAuthor.save();
        res.status(200).json(newAuthor);
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
};
export const getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;
        const author = await Author.findById(id);
        res.status(200).json(author);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};
export const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        await Author.findByIdAndDelete(id);
        res.status(200).json({ message: 'Author deleted successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};
export const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAuthor = await Author.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedAuthor);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};
//# sourceMappingURL=author.js.map