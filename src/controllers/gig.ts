import express from 'express';
import Gig from '../models/gigModel.js';

export const getGig = async (req: express.Request, res: express.Response) => {
  try {
    const gigs = await Gig.find().populate("author", "image name");
    console.log(gigs);
    res.status(200).json(gigs);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const createGig = async (req: express.Request, res: express.Response) => {
  try {
    const gigs = req.body;
    const newGig = new Gig(gigs);
    await newGig.save();
    res.status(200).json(newGig);
    console.log('Gig created successfully');
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
}

export const getGigById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const gig = await Gig.findById(id);
    res.status(200).json(gig);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
}

export const deleteGig = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    await Gig.findByIdAndDelete(id);
    res.status(200).json({ message: 'Gig deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
}

export const updateGig = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const updatedGig = await Gig.findByIdAndUpdate(id, req.body)
    res.status(200).json(updatedGig);
    } catch (error) {
    console.log(error);

    res.status(404).json({ message: error.message });
    }
}