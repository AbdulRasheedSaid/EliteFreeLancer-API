import express from "express";
import { createAuthor, getAuthors, getAuthorById, deleteAuthor, updateAuthor } from "../controllers/author.js";

const router = express.Router();

router.get("/", getAuthors);

router.post("/", createAuthor);

router.get("/:id", getAuthorById);

router.delete("/:id", deleteAuthor);

router.put("/:id", updateAuthor);

export default router;