import express from "express";
import Gig from "../models/gigModel.js";
import lodash from "lodash";

export const verifyAuthorOwnership = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise <any> => {
  try {
    const { gigId } = req.params; // Gig ID from request parameters
    const userId = lodash.get(req, "identity.id") as string; // User ID from req.identity

    if(!userId) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.author.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to perform this action" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
